import { TextConfig } from 'konva/lib/shapes/Text';
import { AITableImage, AITableRect, AITableText } from '../types';
import { ImageConfig } from 'konva/lib/shapes/Image';
import { RectConfig } from 'konva/lib/shapes/Rect';

export function aiTableTextConfigToKonvaConfig(textConfig: AITableText, rowHeight: number): TextConfig {
    const result: TextConfig = {
        x: textConfig.x,
        y: 0,
        text: textConfig.text,
        fill: textConfig.fillStyle,
        fontStyle: textConfig.fontWeight,
        fontSize: textConfig.fontSize,
        align: textConfig.textAlign,
        verticalAlign: textConfig.verticalAlign,
        textDecoration: textConfig.textDecoration,
        height: rowHeight + 1,
        lineHeight: 1.84,
        zIndex: 1000
    };
    return result;
}

export function aiTableImageConfigToKonvaConfig(
    imageConfig: Partial<AITableImage>,
    options: {
        listening?: boolean;
    }
): ImageConfig {
    const img = new Image();
    img.src = imageConfig.url!;
    const result: ImageConfig = {
        ...imageConfig,
        listening: options?.listening,
        image: img
    };
    return result;
}

export function aiTableRectConfigToKonvaConfig(
    rectConfig: AITableRect,
    options?: {
        name?: string;
        listening?: boolean;
    }
): RectConfig {
    const result: RectConfig = {
        name: options?.name,
        ...rectConfig,
        cornerRadius: rectConfig.radius,
        listening: options?.listening ?? false
    };
    return result;
}
