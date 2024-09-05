import { LRUCache } from 'lru-cache';
import { DEFAULT_TEXT_MAX_CACHE } from '../constants';
import { AITableWrapTextResult } from '../types';

const fontCache: { [key: string]: LRUCache<string, number> } = {};
export const textDataCache = new LRUCache<string, AITableWrapTextResult>({
    max: DEFAULT_TEXT_MAX_CACHE
});

/**
 * 计算给定文本在指定字体和 Canvas 环境下的宽度。
 * 它通过缓存机制来优化性能，避免重复计算相同文本的宽度
 */
export const getTextWidth = (ctx: CanvasRenderingContext2D, text: string, font: string) => {
    let width: number | undefined = 0;
    if (!text || typeof text !== 'string') {
        return width;
    }
    let cacheOfFont = fontCache[font];
    if (!cacheOfFont) {
        cacheOfFont = fontCache[font] = new LRUCache({
            max: 500
        });
    }
    width = cacheOfFont.get(text);
    if (width == null) {
        width = ctx!.measureText(text).width;
        cacheOfFont.set(text, width);
    }

    return width;
};
