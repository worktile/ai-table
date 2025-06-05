import { Injectable, NgZone } from '@angular/core';
import { fromEvent, Subscription, animationFrames } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

export interface ScrollableElement {
    horizontalElement?: HTMLElement;
    verticalElement?: HTMLElement;
}

export interface ScrollDistance {
    x: number;
    y: number;
    speedX?: number;
    speedY?: number;
}

export interface ScrollControllerOptions {
    container: {
        width: number;
        height: number;
    };
    element: {
        left?: number;
        top?: number;
        width?: number;
        height?: number;
    };
    direction?: 'horizontal' | 'vertical' | 'both';
    scrollableElement: ScrollableElement;
    frozenArea?: {
        top?: number;
        left?: number;
        right?: number;
        bottom?: number;
    };
    // 平滑滚动配置
    smooth?: boolean;
    autoScroll?: boolean;
    scrollSpeedFactor?: number; // 滚动速度因子，默认1.0
    minScrollSpeed?: number; // 最小滚动速度
    maxScrollSpeed?: number; // 最大滚动速度
    edgeThreshold?: number; // 边缘触发阈值
    onScrollChange?: (position: { x: number; y: number }) => void;
}

@Injectable({ providedIn: 'root' })
export class ScrollControllerService {
    private animationFrame: number | null = null;
    private mouseUpSubscription: Subscription | null = null;

    private isAutoScrolling = false;
    private autoScrollSub: Subscription | null = null;
    private edgeDistanceX = 0;
    private edgeDistanceY = 0;
    private lastAutoScrollOptions: ScrollControllerOptions | null = null;

    constructor(private ngZone: NgZone) {
        this.ngZone.runOutsideAngular(() => {
            this.mouseUpSubscription = fromEvent(document, 'mouseup').subscribe(() => {
                this.handleMouseUp();
            });
        });
    }

    scroll(options: ScrollControllerOptions) {
        const { autoScroll = true } = options;
        const { needsScroll } = this.calculateScrollDistance(options);
        if (!needsScroll) {
            this.isAutoScrolling = false;
            return;
        }
        this.lastAutoScrollOptions = options;
        if (autoScroll && !this.isAutoScrolling) {
            this.startAutoScroll(options);
        }
    }

    private handleMouseUp(): void {
        this.isAutoScrolling = false;
        if (this.autoScrollSub) {
            this.autoScrollSub.unsubscribe();
            this.autoScrollSub = null;
        }
        this.isAutoScrolling = false;
    }

    private startAutoScroll(options: ScrollControllerOptions): void {
        if (this.autoScrollSub) {
            this.autoScrollSub.unsubscribe();
            this.autoScrollSub = null;
        }
        this.isAutoScrolling = true;
        this.ngZone.runOutsideAngular(() => {
            this.autoScrollSub = animationFrames()
                .pipe(
                    takeWhile(() => this.isAutoScrolling),
                    map(() => {
                        const currentOptions = this.lastAutoScrollOptions || options;
                        let currentScrollX = 0;
                        let currentScrollY = 0;
                        const { horizontalElement, verticalElement } = currentOptions.scrollableElement;
                        if (horizontalElement) {
                            currentScrollX = horizontalElement.scrollLeft;
                        }
                        if (verticalElement) {
                            currentScrollY = verticalElement.scrollTop;
                        }

                        // 计算最新滚动距离和速度
                        const { scrollResult } = this.calculateScrollDistance(currentOptions);

                        if (horizontalElement && scrollResult.speedX !== undefined && scrollResult.speedX !== 0) {
                            horizontalElement.scrollLeft = Math.max(0, currentScrollX + scrollResult.speedX);
                        }

                        if (verticalElement && scrollResult.speedY !== undefined && scrollResult.speedY !== 0) {
                            verticalElement.scrollTop = Math.max(0, currentScrollY + scrollResult.speedY);
                        }

                        return {
                            x: horizontalElement?.scrollLeft || 0,
                            y: verticalElement?.scrollTop || 0
                        };
                    })
                )
                .subscribe((position) => {
                    options.onScrollChange?.({ x: position.x, y: position.y });
                });
        });
    }

    // 计算距离和滚动速度
    private calculateScrollDistance(options: ScrollControllerOptions): {
        scrollResult: ScrollDistance;
        needsScroll: boolean;
    } {
        const {
            container,
            element,
            direction = 'both',
            scrollableElement,
            frozenArea = {},
            edgeThreshold = 0,
            minScrollSpeed = 1,
            maxScrollSpeed = 20,
            scrollSpeedFactor = 1
        } = options;

        const { horizontalElement, verticalElement } = scrollableElement;

        // 初始化滚动结果
        const scrollResult: ScrollDistance = {
            x: 0,
            y: 0,
            speedX: 0,
            speedY: 0
        };

        let needsScroll = false;

        // 水平滚动计算
        if (
            (direction === 'horizontal' || direction === 'both') &&
            element.left !== undefined &&
            element.width !== undefined &&
            horizontalElement
        ) {
            const minLeft = frozenArea.left || 0;
            const maxLeft = frozenArea.right || container.width;
            if (element.left < minLeft + edgeThreshold) {
                this.edgeDistanceX = Math.min(0, element.left - minLeft + edgeThreshold);
                const distanceFactor = Math.min(1.0, Math.abs(this.edgeDistanceX) / element.left);
                const speed = this.calculateSpeed(distanceFactor, minScrollSpeed, maxScrollSpeed, scrollSpeedFactor);
                scrollResult.x = this.edgeDistanceX;
                scrollResult.speedX = -speed; // 向左滚动
                needsScroll = true;
            } else if (element.left + element.width > maxLeft - edgeThreshold) {
                const rightEdge = element.left + element.width;
                this.edgeDistanceX = Math.max(0, rightEdge - maxLeft - edgeThreshold);
                const distanceFactor = Math.min(1.0, this.edgeDistanceX / element.width);
                const speed = this.calculateSpeed(distanceFactor, minScrollSpeed, maxScrollSpeed, scrollSpeedFactor);

                scrollResult.x = this.edgeDistanceX;
                scrollResult.speedX = speed;
                needsScroll = true;
            } else {
                this.edgeDistanceX = 0;
                scrollResult.speedX = 0;
            }
        }

        // 垂直滚动计算
        if (
            (direction === 'vertical' || direction === 'both') &&
            element.top !== undefined &&
            element.height !== undefined &&
            verticalElement
        ) {
            const minTop = frozenArea.top || 0;
            const maxTop = frozenArea.bottom || container.height;

            if (element.top < minTop + edgeThreshold) {
                // 向上滚动
                this.edgeDistanceY = Math.min(0, element.top - minTop + edgeThreshold);
                const distanceFactor = Math.min(1.0, Math.abs(this.edgeDistanceY) / element.top);
                const speed = this.calculateSpeed(distanceFactor, minScrollSpeed, maxScrollSpeed, scrollSpeedFactor);
                scrollResult.y = this.edgeDistanceY;
                scrollResult.speedY = -speed; // 负值表示向上滚动
                needsScroll = true;
            } else if (element.top + element.height > maxTop - edgeThreshold) {
                // 向下滚动
                this.edgeDistanceY = Math.max(0, element.top + element.height - maxTop + edgeThreshold);
                const distanceFactor = Math.min(1.0, this.edgeDistanceY / element.height);
                const speed = this.calculateSpeed(distanceFactor, minScrollSpeed, maxScrollSpeed, scrollSpeedFactor);

                scrollResult.y = this.edgeDistanceY;
                scrollResult.speedY = speed;
                needsScroll = true;
            } else {
                // 不在边缘区域，重置边缘距离
                this.edgeDistanceY = 0;
                scrollResult.speedY = 0;
            }
        }

        return { scrollResult, needsScroll };
    }

    /**
     * 计算滚动速度
     * @param distanceFactor 距离因子（0-1）
     * @param minSpeed 最小速度
     * @param maxSpeed 最大速度
     * @param speedFactor 速度因子
     * @returns 计算后的滚动速度
     */
    private calculateSpeed(distanceFactor: number, minSpeed: number, maxSpeed: number, speedFactor: number): number {
        // 二次曲线计算，距离因子越大速度增长越快
        const easedFactor = distanceFactor * distanceFactor;
        // 计算最终速度，范围为 minSpeed 到 maxSpeed 之间
        const speed = minSpeed + (maxSpeed - minSpeed) * easedFactor;
        // 应用全局速度因子
        return speed * speedFactor;
    }

    public destroy(): void {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        if (this.autoScrollSub) {
            this.autoScrollSub.unsubscribe();
            this.autoScrollSub = null;
        }

        if (this.mouseUpSubscription) {
            this.mouseUpSubscription.unsubscribe();
            this.mouseUpSubscription = null;
        }
    }
}
