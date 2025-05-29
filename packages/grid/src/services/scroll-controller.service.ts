import { Injectable } from '@angular/core';

export interface ScrollableElement {
    horizontalElement?: HTMLElement;
    verticalElement?: HTMLElement;
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
    threshold?: number;
    scrollBarSize?: number;
    frozenArea?: {
        top?: number;
        left?: number;
    };
}

@Injectable({ providedIn: 'root' })
export class ScrollControllerService {
    scroll(options: ScrollControllerOptions): { x: number; y: number } {
        const { container, element, direction = 'both', scrollableElement, threshold = 0, frozenArea = {}, scrollBarSize = 18 } = options;

        let currentScrollX = scrollableElement.horizontalElement?.scrollLeft || 0;
        let currentScrollY = scrollableElement.verticalElement?.scrollTop || 0;

        if ((direction === 'horizontal' || direction === 'both') && element.left !== undefined && element.width !== undefined) {
            const minLeft = frozenArea.left || 0;
            if (element.left < minLeft) {
                const scrollX = element.left - minLeft - threshold;
                if (scrollableElement.horizontalElement) {
                    scrollableElement.horizontalElement.scrollLeft += scrollX;
                    currentScrollX = scrollableElement.horizontalElement.scrollLeft;
                }
            } else if (element.left + element.width > container.width - scrollBarSize) {
                const scrollX = element.left + element.width - container.width + threshold + scrollBarSize;
                if (scrollableElement.horizontalElement) {
                    scrollableElement.horizontalElement.scrollLeft += scrollX;
                    currentScrollX = scrollableElement.horizontalElement.scrollLeft;
                }
            }
        }

        if ((direction === 'vertical' || direction === 'both') && element.top !== undefined && element.height !== undefined) {
            const minTop = frozenArea.top || 0;
            if (element.top < minTop) {
                const scrollY = element.top - minTop - threshold;
                if (scrollableElement.verticalElement) {
                    scrollableElement.verticalElement.scrollTop += scrollY;
                    currentScrollY = scrollableElement.verticalElement.scrollTop;
                }
            } else if (element.top + element.height > container.height - scrollBarSize) {
                const scrollY = element.top + element.height - container.height + threshold + scrollBarSize;
                if (scrollableElement.verticalElement) {
                    scrollableElement.verticalElement.scrollTop += scrollY;
                    currentScrollY = scrollableElement.verticalElement.scrollTop;
                }
            }
        }

        return { x: currentScrollX, y: currentScrollY };
    }
}
