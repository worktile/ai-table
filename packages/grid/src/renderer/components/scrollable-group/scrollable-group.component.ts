import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    signal,
    effect,
    ViewChild,
    TemplateRef,
    output,
    AfterViewInit
} from '@angular/core';
import { KO_CONTAINER_TOKEN, KoContainer, KoEventObject } from '../../../angular-konva';
import { KoShape } from '../../../angular-konva/components/shape.component';
import { Colors } from '../../../constants';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { Vector2d } from 'konva/lib/types';

export interface ScrollableGroupConfig {
    width: number;
    height: number;
    contentWidth: number;
    contentHeight: number;
    x?: number;
    y?: number;
    scrollbarSize?: number;
    scrollbarColor?: string;
    scrollbarTrackColor?: string;
    verticalScrollbar?: boolean;
    horizontalScrollbar?: boolean;
    contentNotScrollbar?: boolean;
}

@Component({
    selector: 'ai-table-scrollable-group',
    template: `
        <ko-group #rootGroup [config]="containerConfig()" (koWheel)="stageWheel($event)">
            <ko-group>
                <ko-rect [config]="bgConfig()"></ko-rect>
            </ko-group>

            <!-- 内容区域 -->
            <ko-group #contentGroup [config]="contentConfig()">
                <ng-content></ng-content>
            </ko-group>

            <ko-group>
                @if (showVerticalScrollbar()) {
                    <ko-group
                        [config]="verticalScrollbarConfig()"
                        (koMouseenter)="setHoverScrollbarStatus(true)"
                        (koMouseleave)="setHoverScrollbarStatus(false)"
                        (koClick)="verticalScrollbarClick($event)"
                    >
                        <!-- 滚动条轨道 -->
                        <ko-rect #verticalTrack [config]="verticalTrackConfig()"></ko-rect>
                        <!-- 滚动条滑块 -->
                        @if (!hiddenScrollbar() || isHoverScrollbar()) {
                            <ko-rect #verticalThumb [config]="verticalConfig()"></ko-rect>
                        }
                    </ko-group>
                }

                <!-- 横向滚动条 -->
                @if (showHorizontalScrollbar()) {
                    <ko-group
                        [config]="horizontalScrollbarConfig()"
                        (koMouseenter)="setHoverScrollbarStatus(true)"
                        (koMouseleave)="setHoverScrollbarStatus(false)"
                        (koClick)="horizontalScrollbarClick($event)"
                    >
                        <!-- 滚动条轨道 -->
                        <ko-rect #horizontalTrack [config]="horizontalTrackConfig()"></ko-rect>
                        <!-- 滚动条滑块 -->
                        @if (!hiddenScrollbar() || isHoverScrollbar()) {
                            <ko-rect [config]="horizontalThumbConfig()"></ko-rect>
                        }
                    </ko-group>
                }
            </ko-group>
        </ko-group>
    `,
    imports: [KoContainer, KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableScrollableGroup implements AfterViewInit {
    config = input.required<ScrollableGroupConfig>();

    contentTemplate = input.required<KoContainer>();

    parentContainer = input<KoContainer>();

    scrollPosition = output<{ scrollX: number; scrollY: number }>();

    @ViewChild('verticalTrack') verticalTrack!: KoShape;
    @ViewChild('verticalThumb') verticalThumb!: KoShape;
    @ViewChild('horizontalTrack') horizontalTrack!: KoShape;
    @ViewChild('contentGroup') contentGroup!: KoContainer;
    @ViewChild('rootGroup') rootGroup!: KoContainer;

    private hiddenScrollbarTimer: any;

    displayScrollbarTime = signal<Date | null>(null);

    hiddenScrollbar = signal<boolean>(true);

    isHoverScrollbar = signal<boolean>(false);

    // 滚动位置信号
    scrollX = signal(0);
    scrollY = signal(0);

    // 滚动条拖拽状态
    isDraggingVertical = signal(false);
    isDraggingHorizontal = signal(false);

    constructor() {
        // 滚动条延迟隐藏
        effect(() => {
            const displayScrollbarTime = this.displayScrollbarTime();
            if (displayScrollbarTime) {
                this.hiddenScrollbar.set(false);
                clearTimeout(this.hiddenScrollbarTimer);
                this.hiddenScrollbarTimer = setTimeout(() => {
                    this.hiddenScrollbar.set(true);
                }, 1000);
            }
        });

        effect(() => {
            const scrollX = this.scrollX();
            const scrollY = this.scrollY();
            this.scrollPosition.emit({ scrollX, scrollY });
        });
    }

    ngAfterViewInit() {
        this.contentTemplate().getNode().moveTo(this.contentGroup.getNode());
        if (this.parentContainer() && this.rootGroup) {
            this.rootGroup.getNode().moveTo(this.parentContainer()!.getNode());
        }
    }

    // 容器配置
    containerConfig = computed(() => {
        const { x = 0, y = 0, width, height } = this.config();
        return {
            x,
            y,
            width,
            height,
            fill: Colors.black,
            listening: true,
            clipX: 0,
            clipY: 0,
            clipWidth: width,
            clipHeight: height,
            name: 'scrollable-group'
        };
    });

    bgConfig = computed(() => {
        const { x = 0, y = 0, width, height } = this.config();
        return {
            x: 0,
            y: 0,
            width,
            height,
            listening: true
        };
    });

    // 内容区域配置
    contentConfig = computed(() => {
        if (this.config().contentNotScrollbar) {
            return {
                offsetX: 0,
                offsetY: 0
            };
        }
        return {
            offsetX: this.scrollX(),
            offsetY: this.scrollY()
        };
    });

    // 是否显示竖向滚动条
    showVerticalScrollbar = computed(() => {
        const { height, contentHeight, verticalScrollbar } = this.config();
        return verticalScrollbar && contentHeight > height;
    });

    // 是否显示横向滚动条
    showHorizontalScrollbar = computed(() => {
        const { width, contentWidth, horizontalScrollbar } = this.config();
        return horizontalScrollbar && contentWidth > width;
    });

    // 竖向滚动条配置
    verticalScrollbarConfig = computed(() => {
        const { width, scrollbarSize = 12 } = this.config();
        return {
            x: width - scrollbarSize,
            y: 0,
            width: scrollbarSize,
            height: this.verticalScrollbarHeight()
        };
    });

    // 横向滚动条配置
    horizontalScrollbarConfig = computed(() => {
        const { height, scrollbarSize = 12 } = this.config();
        return {
            x: 0,
            y: height - scrollbarSize,
            width: this.horizontalScrollbarHeight(),
            height: scrollbarSize
        };
    });

    // 竖向滚动条轨道配置
    verticalTrackConfig = computed(() => {
        const { scrollbarSize = 12, scrollbarTrackColor, height } = this.config();
        return {
            x: 0,
            y: 0,
            width: scrollbarSize,
            height: height,
            fill: scrollbarTrackColor,
            cornerRadius: 2
        };
    });

    // 横向滚动条轨道配置
    horizontalTrackConfig = computed(() => {
        const { scrollbarSize = 12, scrollbarTrackColor } = this.config();
        return {
            x: 0,
            y: 0,
            width: this.horizontalScrollbarHeight(),
            height: scrollbarSize,
            fill: scrollbarTrackColor,
            cornerRadius: 2
        };
    });

    verticalThumbMinY = computed<number>(() => {
        const getAbsolutePositionY = this.verticalTrack.getNode().getAbsolutePosition().y;
        return getAbsolutePositionY;
    });

    // 垂直滚动条滑块的最大Y坐标
    verticalThumbMaxY = computed<number>(() => {
        const { height, contentHeight } = this.config();
        const getAbsolutePositionY = this.verticalTrack.getNode().getAbsolutePosition().y;
        return getAbsolutePositionY + height - this.verticalThumbHeight();
    });

    // 横向滚动条滑块的最小X坐标
    horizontalThumbMinX = computed<number>(() => {
        const getAbsolutePositionX = this.horizontalTrack.getNode().getAbsolutePosition().x;
        return getAbsolutePositionX;
    });

    // 横向滚动条滑块的最大X坐标
    horizontalThumbMaxX = computed<number>(() => {
        const { width } = this.config();
        const getAbsolutePositionX = this.horizontalTrack.getNode().getAbsolutePosition().x;
        return getAbsolutePositionX + width - this.horizontalThumbWidth();
    });

    // 竖向滚动条滑块高度
    verticalThumbHeight = computed<number>(() => {
        const { height, contentHeight } = this.config();
        const thumbHeight = Math.max(20, (height / contentHeight) * this.verticalScrollbarHeight());
        return thumbHeight;
    });

    // 横向滚动条滑块宽度
    horizontalThumbWidth = computed<number>(() => {
        const { width, contentWidth } = this.config();
        const thumbWidth = Math.max(20, (width / contentWidth) * this.horizontalScrollbarHeight());
        return thumbWidth;
    });

    // 竖向滚动条滑块配置
    verticalConfig = computed<RectConfig | any>(() => {
        if (this.isDraggingVertical()) {
            return null;
        }
        const { scrollbarSize = 12, scrollbarColor = '#c0c0c0' } = this.config();
        const { height, contentHeight } = this.config();
        const thumbHeight = this.verticalThumbHeight();
        const thumbY = (this.scrollY() / (contentHeight - height)) * (this.verticalScrollbarHeight() - thumbHeight);

        return {
            x: 1,
            y: thumbY,
            width: scrollbarSize - 2,
            height: thumbHeight,
            fill: scrollbarColor,
            cornerRadius: 6,
            draggable: true,
            dragBoundFunc: (pos: Vector2d) => {
                this.isDraggingVertical.set(true);
                this.displayScrollbarTime.set(new Date());

                // 限定垂直滚动条的拖拽范围，并更新newScrollY
                const maxThumbY = this.verticalThumbMaxY();
                const minThumbY = this.verticalThumbMinY();
                const newThumbY = Math.max(Math.min(pos.y, maxThumbY), minThumbY);
                const deltaY = newThumbY - this.verticalTrack.getNode().getAbsolutePosition().y;
                const newScrollY = (deltaY / (this.verticalScrollbarHeight() - this.verticalThumbHeight())) * (contentHeight - height);
                this.scrollY.set(newScrollY);

                const x = this.verticalTrack.getNode().getAbsolutePosition().x + 1;
                setTimeout(() => {
                    this.isDraggingVertical.set(false);
                }, 100);
                return {
                    x: x,
                    y: newThumbY
                };
            }
        };
    });

    // 横向滚动条滑块配置
    horizontalThumbConfig = computed<RectConfig | any>(() => {
        if (this.isDraggingHorizontal()) {
            return null;
        }
        const { scrollbarSize = 12, scrollbarColor = '#c0c0c0' } = this.config();
        const { width, contentWidth } = this.config();
        const thumbWidth = this.horizontalThumbWidth();
        const thumbX = (this.scrollX() / (contentWidth - width)) * (this.horizontalScrollbarHeight() - thumbWidth);

        return {
            x: thumbX,
            y: 1,
            width: thumbWidth,
            height: scrollbarSize - 2,
            fill: scrollbarColor,
            cornerRadius: 6,
            draggable: true,
            dragBoundFunc: (pos: Vector2d) => {
                this.isDraggingHorizontal.set(true);
                this.displayScrollbarTime.set(new Date());
                // 限定横向滚动条的拖拽范围,并更新scrollX
                const maxThumbX = this.horizontalThumbMaxX();
                const minThumbX = this.horizontalThumbMinX();
                const newThumbX = Math.max(Math.min(pos.x, maxThumbX), minThumbX);
                const deltaX = newThumbX - this.horizontalTrack.getNode().getAbsolutePosition().x;
                const newScrollX = (deltaX / (this.horizontalScrollbarHeight() - this.horizontalThumbWidth())) * (contentWidth - width);
                this.scrollX.set(newScrollX);

                const y = this.horizontalTrack.getNode().getAbsolutePosition().y + 1;
                setTimeout(() => {
                    this.isDraggingHorizontal.set(false);
                }, 100);
                return {
                    x: newThumbX,
                    y: y
                };
            }
        };
    });

    // 横向滚动条滑块配置
    verticalScrollbarHeight = computed(() => {
        const { height } = this.config();
        return height;
    });

    // 获取横向滚动条宽度
    horizontalScrollbarHeight = computed(() => {
        const { width } = this.config();
        return width;
    });

    verticalScrollbarClick(e: KoEventObject<MouseEvent>) {
        const { contentHeight, height } = this.config();
        const y = e.event.evt.offsetY - this.verticalThumbHeight() / 2;
        const maxThumbY = this.verticalThumbMaxY();
        const minThumbY = this.verticalThumbMinY();
        const newThumbY = Math.max(Math.min(y, maxThumbY), minThumbY);
        const deltaY = newThumbY - this.verticalTrack.getNode().getAbsolutePosition().y;
        const newScrollY = (deltaY / (this.verticalScrollbarHeight() - this.verticalThumbHeight())) * (contentHeight - height);
        this.scrollY.set(newScrollY);
    }

    horizontalScrollbarClick(e: KoEventObject<MouseEvent>) {
        const { contentWidth, width } = this.config();
        const x = e.event.evt.offsetX - this.horizontalThumbWidth() / 2;
        const maxThumbX = this.horizontalThumbMaxX();
        const minThumbX = this.horizontalThumbMinX();
        const newThumbX = Math.max(Math.min(x, maxThumbX), minThumbX);
        const deltaX = newThumbX - this.horizontalTrack.getNode().getAbsolutePosition().x;
        const newScrollX = (deltaX / (this.horizontalScrollbarHeight() - this.horizontalThumbWidth())) * (contentWidth - width);
        this.scrollX.set(newScrollX);
    }

    setHoverScrollbarStatus(isHover: boolean) {
        this.isHoverScrollbar.set(isHover);
        this.displayScrollbarTime.set(new Date());
    }

    stageWheel(e: KoEventObject<WheelEvent>) {
        if (!this.showVerticalScrollbar() && !this.showHorizontalScrollbar()) {
            return;
        }
        this.displayScrollbarTime.set(new Date());
        e.event.cancelBubble = true;
        this.scrollByDelta({ deltaX: e.event.evt.deltaX, deltaY: e.event.evt.deltaY });
    }

    scrollByDelta(delta: { deltaX?: number; deltaY?: number }) {
        const { deltaX = 0, deltaY = 0 } = delta;
        const { contentWidth, contentHeight, width, height, horizontalScrollbar, verticalScrollbar } = this.config();
        if (horizontalScrollbar && deltaX > 0 && contentWidth - width > this.scrollX()) {
            const newScrollX = Math.min(this.scrollX() + deltaX, contentWidth - width);
            if (newScrollX !== this.scrollX()) {
                this.scrollX.set(newScrollX);
            }
        }
        if (horizontalScrollbar && deltaX < 0 && this.scrollX() > 0) {
            const newScrollX = Math.max(0, this.scrollX() + deltaX);
            if (newScrollX !== this.scrollX()) {
                this.scrollX.set(newScrollX);
            }
        }
        if (verticalScrollbar && deltaY > 0 && contentHeight - height > this.scrollY()) {
            const newScrollY = Math.min(this.scrollY() + deltaY, contentHeight - height);
            if (newScrollY !== this.scrollY()) {
                this.scrollY.set(newScrollY);
            }
        }
        if (verticalScrollbar && deltaY < 0 && this.scrollY() > 0) {
            const newScrollY = Math.max(0, this.scrollY() + deltaY);
            if (newScrollY !== this.scrollY()) {
                this.scrollY.set(newScrollY);
            }
        }
    }

    // 滚动到指定位置
    scrollTo(x: number, y: number) {
        const { width, height, contentWidth, contentHeight } = this.config();

        this.scrollX.set(Math.max(0, Math.min(contentWidth - width, x)));
        this.scrollY.set(Math.max(0, Math.min(contentHeight - height, y)));
    }

    // 滚动到顶部
    scrollToTop() {
        this.scrollY.set(0);
    }

    // 滚动到底部
    scrollToBottom() {
        const { height, contentHeight } = this.config();
        this.scrollY.set(Math.max(0, contentHeight - height));
    }

    // 滚动到左侧
    scrollToLeft() {
        this.scrollX.set(0);
    }

    // 滚动到右侧
    scrollToRight() {
        const { width, contentWidth } = this.config();
        this.scrollX.set(Math.max(0, contentWidth - width));
    }
}
