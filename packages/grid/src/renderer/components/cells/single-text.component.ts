import { ChangeDetectionStrategy, Component, computed, effect, signal, untracked } from '@angular/core';
import {
    AI_TABLE_CELL,
    AI_TABLE_CELL_BORDER,
    AI_TABLE_CELL_LINE_BORDER,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_ROW_BLANK_HEIGHT,
    AI_TABLE_ROW_HEIGHT,
    AI_TABLE_TEXT_LINE_HEIGHT,
    Colors,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_SIZE,
    DEFAULT_FONT_STYLE,
    DEFAULT_TEXT_ALIGN_LEFT,
    DEFAULT_TEXT_ELLIPSIS,
    DEFAULT_TEXT_TRANSFORMS_ENABLED
} from '../../../constants';
import { generateTargetName, setExpandCellInfo } from '../../../utils';
import { AITableFieldType, isUndefinedOrNull } from '@ai-table/utils';
import { TextConfig } from 'konva/lib/shapes/Text';
import { AITableTextComponent } from '../text.component';
import { CoverCellBase } from './cover-cell-base';
import { KoShape, KoContainer } from '../../../angular-konva';
import Konva from 'konva';
import { AITableScrollableGroup, ScrollableGroupConfig } from '../scrollable-group';

@Component({
    selector: 'ai-table-single-text',
    template: `
        <ko-group>
            @if (isExpand()) {
                <ko-group>
                    <ko-group #rootGroup>
                        <ai-table-scrollable-group [config]="scrollConfig()" [contentTemplate]="contentGroup" [parentContainer]="rootGroup">
                            <ko-group #contentGroup>
                                <ai-table-text [config]="expandTextConfig()!"></ai-table-text>
                            </ko-group>
                        </ai-table-scrollable-group>
                    </ko-group>
                    <ko-group>
                        <ko-rect [config]="expandBorderConfig()!"></ko-rect>
                    </ko-group>
                </ko-group>
            } @else {
                @if (textConfig()) {
                    <ko-group>
                        <ai-table-text [config]="textConfig()!"></ai-table-text>
                    </ko-group>
                }
            }
        </ko-group>
    `,
    imports: [AITableTextComponent, KoShape, KoContainer, AITableScrollableGroup],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellText extends CoverCellBase {
    static override fieldType = AITableFieldType.text;

    // 缓存文本边界计算结果，避免重复计算
    private cachedBounds = signal<{ width: number; height: number; x: number; y: number } | null>(null);
    private cacheKey = signal<string>('');

    cellName = computed(() => {
        const { field, recordId } = this.config()?.render!;
        return generateTargetName({
            targetName: AI_TABLE_CELL,
            fieldId: field._id,
            recordId
        });
    });

    constructor() {
        super();
        effect(() => {
            const height = this.height();
            if (this.isExpand()) {
                untracked(() => {
                    const { render, aiTable } = this.config()!;
                    const { columnWidth } = render;
                    setExpandCellInfo(aiTable, { width: columnWidth, height });
                });
            }
        });

        // 监听展开状态和文本内容变化，异步计算边界
        effect((cleanup) => {
            if (!this.isExpand()) {
                untracked(() => {
                    this.cachedBounds.set(null);
                    this.cacheKey.set('');
                });
                return;
            }

            const textRender = this.textString();
            if (!textRender) {
                return;
            }

            const textWidth = this.textMaxWidth();
            const startY = this.startY();
            const key = `${textRender}_${textWidth}_${startY}`;

            if (this.cacheKey() === key && this.cachedBounds()) {
                return;
            }

            // 立即设置初始值，让 UI 立即响应
            untracked(() => {
                const initialHeight = this.config()?.render?.rowHeight || AI_TABLE_ROW_BLANK_HEIGHT;
                this.cachedBounds.set({
                    width: textWidth,
                    height: initialHeight,
                    x: 0,
                    y: 0
                });
            });

            // 异步计算，不阻塞 UI，展开更流畅
            const requestAimationFrameId = requestAnimationFrame(() => {
                if (this.cacheKey() === key) {
                    return;
                }

                const tmpText = new Konva.Text({
                    text: textRender,
                    fontSize: DEFAULT_FONT_SIZE,
                    fontFamily: DEFAULT_FONT_FAMILY,
                    lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
                    wrap: 'char',
                    width: textWidth,
                    align: DEFAULT_TEXT_ALIGN_LEFT,
                    verticalAlign: 'top',
                    fontStyle: DEFAULT_FONT_STYLE,
                    ellipsis: DEFAULT_TEXT_ELLIPSIS,
                    transformsEnabled: DEFAULT_TEXT_TRANSFORMS_ENABLED,
                    listening: false
                });
                const rect = tmpText.getClientRect();

                // 如果不加 untracked，展开的过程会晃眼
                untracked(() => {
                    this.cachedBounds.set({
                        ...rect,
                        height: rect.height + startY * 2 - AI_TABLE_CELL_LINE_BORDER
                    });
                    this.cacheKey.set(key);
                });
            });

            cleanup(() => {
                cancelAnimationFrame(requestAimationFrameId);
            });
        });
    }

    expandBorderConfig = computed(() => {
        const { render, field, recordId, isExpand } = this.config()!;
        const { columnWidth } = render;
        if (isExpand) {
            return {
                name: generateTargetName({
                    targetName: AI_TABLE_CELL,
                    fieldId: field._id,
                    recordId
                }),
                width: columnWidth - AI_TABLE_CELL_BORDER / 2,
                height: this.height(),
                stroke: Colors.primary,
                strokeWidth: 2,
                listening: false
            };
        }
        return null;
    });

    scrollConfig = computed<ScrollableGroupConfig>(() => {
        const { render } = this.config()!;
        const { columnWidth } = render;
        const bounds = this.expandTextBounds();
        const contentHeight = bounds?.height || 0;

        return {
            width: columnWidth,
            height: this.height(),
            contentWidth: columnWidth, // 内容宽度大于容器宽度，会显示横向滚动条
            contentHeight: contentHeight, // 内容高度大于容器高度，会显示竖向滚动条
            scrollbarSize: 9,
            scrollbarColor: Colors.gray700,
            x: 0,
            y: 0,
            listening: true,
            verticalScrollbar: true,
            horizontalScrollbar: true,
            contentNotScrollbar: false,
            bgName: this.cellName()
        };
    });

    expandTextBounds = computed(() => {
        if (!this.isExpand()) {
            return null;
        }

        const cached = this.cachedBounds();
        if (cached) {
            return cached;
        }

        const textWidth = this.textMaxWidth();
        const initialHeight = this.config()?.render?.rowHeight || AI_TABLE_ROW_BLANK_HEIGHT;
        return {
            width: textWidth,
            height: initialHeight,
            x: 0,
            y: 0
        };
    });

    textMaxWidth = computed(() => {
        const { columnWidth } = this.config()?.render!;
        return columnWidth - AI_TABLE_CELL_PADDING - AI_TABLE_CELL_PADDING;
    });

    textString = computed(() => {
        const { transformValue } = this.config()?.render!;
        let textRender: string | undefined = transformValue;
        if (isUndefinedOrNull(textRender)) {
            return;
        }
        return textRender.replace(/\r|\n/g, ' ');
    });

    height = computed(() => {
        const { height } = this.expandTextBounds() || { height: 0 };
        return Math.min(Math.max(height, this.config()!.render.rowHeight - AI_TABLE_CELL_LINE_BORDER || AI_TABLE_ROW_BLANK_HEIGHT), 146);
    });

    startY = computed(() => {
        const { y } = this.config()?.render!;
        return (
            y +
            (AI_TABLE_ROW_HEIGHT - DEFAULT_FONT_SIZE) / 2 -
            (DEFAULT_FONT_SIZE * (AI_TABLE_TEXT_LINE_HEIGHT - 1)) / 2 +
            AI_TABLE_CELL_LINE_BORDER
        );
    });

    expandTextConfig = computed<TextConfig | undefined>(() => {
        const render = this.config()?.render;
        if (render) {
            const { x, zIndex } = render;
            let textRender: string | undefined = this.textString();
            if (isUndefinedOrNull(textRender)) {
                return;
            }
            const bounds = this.expandTextBounds();
            const height = bounds?.height || 0;

            return {
                x,
                y: this.startY(),
                name: this.cellName(),
                text: textRender,
                wrap: 'char',
                width: this.textMaxWidth(),
                fillStyle: Colors.primary,
                lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
                verticalAlign: 'top',
                height,
                listening: true,
                ellipsis: true,
                zIndex
            };
        }
        return;
    });

    textConfig = computed<TextConfig | undefined>(() => {
        const render = this.config()?.render;
        if (render) {
            const { x, rowHeight, zIndex } = render;
            let textRender: string | undefined = this.textString();
            if (isUndefinedOrNull(textRender)) {
                return;
            }

            return {
                x,
                y: this.startY(),
                verticalAlign: 'top',
                text: textRender,
                wrap: 'char',
                width: this.textMaxWidth(),
                fillStyle: Colors.primary,
                height: rowHeight + AI_TABLE_CELL_LINE_BORDER * 2,
                lineHeight: AI_TABLE_TEXT_LINE_HEIGHT,
                listening: false,
                ellipsis: true,
                zIndex
            };
        }
        return;
    });
}
