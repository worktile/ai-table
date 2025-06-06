import { Injectable, NgZone } from '@angular/core';
import { isObject } from 'lodash';
import { fromEvent, Subscription, animationFrames } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

export interface AITableScrollableElement {
    horizontalElement?: HTMLElement;
    verticalElement?: HTMLElement;
}

export interface AITableScrollDistance {
    x: number;
    y: number;
    speedX?: number;
    speedY?: number;
}

export type AITableScrollEdgeThreshold = number | { left: number; right: number; top: number; bottom: number };

export interface AITableScrollControllerOptions {
    container: {
        width: number;
        height: number;
    };
    targetPoint: {
        x: number;
        y: number;
    };
    targetElement?: {
        width?: number;
        height?: number;
    };
    direction?: 'horizontal' | 'vertical' | 'both';
    scrollableElement: AITableScrollableElement;
    frozenArea?: {
        top?: number;
        left?: number;
        right?: number;
        bottom?: number;
    };
    scrollSpeedFactor?: number; // 滚动速度因子，默认1.0
    minScrollSpeed?: number; // 最小滚动速度
    maxScrollSpeed?: number; // 最大滚动速度
    edgeThreshold?: AITableScrollEdgeThreshold; // 边缘触发阈值
    onScrollChange?: (position: { x: number; y: number }, isAutoScrolling: boolean) => void;
}

@Injectable()
export class AITableScrollControllerService {
    private animationFrame: number | null = null;
    private mouseUpSubscription: Subscription | null = null;

    private isAutoScrolling = false;
    private autoScrollSub: Subscription | null = null;
    private edgeDistanceX = 0;
    private edgeDistanceY = 0;
    private lastAutoScrollOptions: AITableScrollControllerOptions | null = null;

    constructor(private ngZone: NgZone) {
        this.ngZone.runOutsideAngular(() => {
            this.mouseUpSubscription = fromEvent(document, 'mouseup').subscribe(() => {
                this.handleMouseUp();
            });
        });
    }

    scroll(options: AITableScrollControllerOptions) {
        const { needsScroll } = this.calculateScrollDistance(options);
        if (!needsScroll) {
            this.isAutoScrolling = false;
            return;
        }
        this.lastAutoScrollOptions = options;
        if (!this.isAutoScrolling) {
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

    private startAutoScroll(options: AITableScrollControllerOptions): void {
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
                        let left = 0;
                        let top = 0;
                        if (horizontalElement && scrollResult.speedX !== undefined && scrollResult.speedX !== 0) {
                            left = Math.max(0, currentScrollX + scrollResult.speedX);
                            horizontalElement.scrollLeft = left;
                        }

                        if (verticalElement && scrollResult.speedY !== undefined && scrollResult.speedY !== 0) {
                            top = Math.max(0, currentScrollY + scrollResult.speedY);
                            verticalElement.scrollTop = top;
                        }
                        this.isAutoScrolling = left !== 0 || top !== 0;

                        return {
                            x: horizontalElement?.scrollLeft || 0,
                            y: verticalElement?.scrollTop || 0
                        };
                    })
                )
                .subscribe((position) => {
                    options.onScrollChange?.({ x: position.x, y: position.y }, this.isAutoScrolling);
                });
        });
    }

    private getEdgeThreshold(threshold: AITableScrollEdgeThreshold, direction: 'left' | 'right' | 'top' | 'bottom'): number {
        const defaultThreshold = 10; // 默认阈值
        if (isObject(threshold)) {
            return threshold[direction] || defaultThreshold;
        }
        return threshold || defaultThreshold;
    }

    // 计算距离和滚动速度
    private calculateScrollDistance(options: AITableScrollControllerOptions): {
        scrollResult: AITableScrollDistance;
        needsScroll: boolean;
    } {
        const {
            container,
            targetPoint,
            targetElement,
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
        const scrollResult: AITableScrollDistance = {
            x: 0,
            y: 0,
            speedX: 0,
            speedY: 0
        };

        let needsScroll = false;

        // 水平滚动计算
        if ((direction === 'horizontal' || direction === 'both') && horizontalElement) {
            const minLeft = frozenArea.left || 0;
            const maxLeft = frozenArea.right || container.width;
            const leftEdgeThreshold = this.getEdgeThreshold(edgeThreshold, 'left');
            const rightEdgeThreshold = this.getEdgeThreshold(edgeThreshold, 'right');
            if (targetPoint.x < minLeft + leftEdgeThreshold) {
                this.edgeDistanceX = Math.abs(minLeft + leftEdgeThreshold - targetPoint.x);
                // point点位离左边界阈值越远，速度越快
                const distanceFactor = Math.min(1.0, this.edgeDistanceX / leftEdgeThreshold);
                const speed = this.calculateSpeed(distanceFactor, minScrollSpeed, maxScrollSpeed, scrollSpeedFactor);
                scrollResult.x = this.edgeDistanceX;
                scrollResult.speedX = -speed; // 向左滚动
                needsScroll = this.edgeDistanceX > 0;
            } else if (targetPoint.x + (targetElement?.width || 0) > maxLeft - rightEdgeThreshold) {
                const rightEdge = targetPoint.x + (targetElement?.width || 0);
                this.edgeDistanceX = Math.abs(rightEdge - maxLeft + rightEdgeThreshold);
                const distanceFactor = Math.min(1.0, this.edgeDistanceX / rightEdgeThreshold);
                const speed = this.calculateSpeed(distanceFactor, minScrollSpeed, maxScrollSpeed, scrollSpeedFactor);
                scrollResult.x = this.edgeDistanceX;
                scrollResult.speedX = speed;
                needsScroll = this.edgeDistanceX > 0;
            } else {
                this.edgeDistanceX = 0;
                scrollResult.speedX = 0;
            }
        }

        // 垂直滚动计算
        if ((direction === 'vertical' || direction === 'both') && verticalElement) {
            const minTop = frozenArea.top || 0;
            const maxTop = frozenArea.bottom || container.height;

            const topEdgeThreshold = this.getEdgeThreshold(edgeThreshold, 'top');
            const bottomEdgeThreshold = this.getEdgeThreshold(edgeThreshold, 'bottom');
            if (targetPoint.y < minTop + topEdgeThreshold) {
                // 滚动距离
                this.edgeDistanceY = Math.abs(minTop + topEdgeThreshold - targetPoint.y);
                const distanceFactor = Math.min(1.0, this.edgeDistanceY / topEdgeThreshold);
                const speed = this.calculateSpeed(distanceFactor, minScrollSpeed, maxScrollSpeed, scrollSpeedFactor);
                scrollResult.y = this.edgeDistanceY;
                scrollResult.speedY = -speed; // 负值表示向上滚动
                needsScroll = this.edgeDistanceY > 0;
            } else if (targetPoint.y + (targetElement?.height || 0) > maxTop - bottomEdgeThreshold) {
                // 向下滚动
                this.edgeDistanceY = Math.abs(targetPoint.y + (targetElement?.height || 0) - maxTop + bottomEdgeThreshold);
                const distanceFactor = Math.min(1.0, this.edgeDistanceY / bottomEdgeThreshold);
                const speed = this.calculateSpeed(distanceFactor, minScrollSpeed, maxScrollSpeed, scrollSpeedFactor);

                scrollResult.y = this.edgeDistanceY;
                scrollResult.speedY = speed;
                needsScroll = this.edgeDistanceY > 0;
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
