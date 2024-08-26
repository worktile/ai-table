import { castToString } from './common';

export interface AITableTextMeasureOptions {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    fontStyle?: string;
    lineHeight?: number;
    scale?: number;
}

/**
 * 在 Canvas 上测量文本的宽度和高度，以便在显示文本时能够动态调整布局或限制文本的显示区域
 * @param defaults
 * @returns
 */
export const TextMeasure = (defaults: AITableTextMeasureOptions = {}) => {
    const {
        fontFamily = `'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
        fontSize = 13,
        fontWeight = 'normal',
        fontStyle = 'normal',
        lineHeight = 24,
        scale = 1
    } = defaults;
    const o: Required<AITableTextMeasureOptions> = {
        fontFamily,
        fontSize,
        fontWeight,
        fontStyle,
        lineHeight,
        scale
    };
    const canvas = document.createElement('canvas');
    const context = canvas ? canvas.getContext('2d') : null;

    const normalizeFontFamily = (fontFamily: string) => {
        return fontFamily
            .split(',')
            .map((family) => {
                family = family.trim();
                const hasSpace = family.indexOf(' ') >= 0;
                const hasQuotes = family.indexOf('"') >= 0 || family.indexOf("'") >= 0;
                if (hasSpace && !hasQuotes) {
                    family = `"${family}"`;
                }
                return family;
            })
            .join(', ');
    };

    // 可以在运行时动态调整字体样式，从而影响后续的文本测量
    const setFont = (options: AITableTextMeasureOptions = {}) => {
        for (const key in options) {
            (o as any)[key] = (options as any)[key] ?? (o as any)[key];
        }
        if (context) {
            context.font = `${o.fontWeight} ${o.fontSize * o.scale}px ${normalizeFontFamily(o.fontFamily)}`;
        }
    };

    // 根据指定的最大宽度和行数来计算文本的显示方式。如果文本太长，它会自动换行或截断，并返回是否发生溢出的信息
    const getWidthOfLongestText = (text: string | null, maxWidth?: number, maxLineCount?: number) => {
        let width = 0;
        let height = 0;
        let lineCount = 0;
        if (text == null) {
            return { width, height, lastLineWidth: 0 };
        }
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]!;
            const lineWidth = context?.measureText(line).width ?? 0;
            width = Math.max(width, lineWidth);
            lineCount = maxWidth != null ? Math.ceil(lineWidth / maxWidth) || 1 : 1;
            height += o.lineHeight * lineCount;
        }
        if (maxWidth == null || maxLineCount === 1 || (maxLineCount && lineCount <= maxLineCount)) {
            return {
                width: Math.ceil(width),
                height: Math.ceil(height),
                text,
                isOverflow: Boolean(maxLineCount && lineCount > maxLineCount),
                lastLineWidth: Math.ceil(width)
            };
        }

        const arrText = text.split('');
        let rowCount = 0; // 总行数
        let textHeight = 0; // 文本最终占用的高度
        let showText = ''; // 每行展示的文本
        let totalText = '';
        let isLimitRow = false;
        const textLength = arrText.length;

        for (let n = 0; n < textLength; n++) {
            const singleText = arrText[n]!;
            const composeText = showText + singleText;
            // 如果没有超过 maxLineCount，就会继续换行
            isLimitRow = maxLineCount ? rowCount === maxLineCount - 1 : false;
            const measureText = isLimitRow ? composeText + '…' : composeText;
            totalText += singleText;
            const textWidth = context?.measureText(measureText).width ?? 0;
            const isLineBreak = ['\n', '\r'].includes(singleText);
            if (((maxWidth && textWidth > maxWidth) || isLineBreak) && (maxLineCount == null || rowCount < maxLineCount)) {
                showText = isLineBreak ? '' : singleText;
                textHeight += lineHeight;
                rowCount++;
                if (isLimitRow) {
                    if (n < textLength - 1) {
                        totalText = totalText.substring(0, totalText.length - 1) + '…';
                    }
                    break;
                }
            } else {
                showText = composeText;
            }
        }
        return {
            width: Math.ceil(width),
            height: Math.ceil(maxLineCount == null || rowCount < maxLineCount ? textHeight + lineHeight : textHeight),
            text: totalText,
            isOverflow: isLimitRow,
            lastLineWidth: context?.measureText(showText).width ?? 0
        };
    };

    // 测量给定文本的宽度和高度。
    // 支持指定最大宽度 (maxWidth) 和最大行数 (maxLineCount)，从而能够处理多行文本的自动换行和截断（例如在文本超过行数限制时添加省略号 "…"）
    const measureText = (text: string, maxWidth?: number, maxLineCount?: number) => {
        return getWidthOfLongestText(castToString(text), maxWidth, maxLineCount);
    };

    // 可以将字体样式重置为初始默认配置
    const reset = () => setFont(defaults);

    setFont(o);

    return {
        context,
        measureText,
        setFont,
        reset
    };
};
