import { TextConfig } from 'konva/lib/shapes/Text';
import { AITableImage, AITableRect, AITableText } from '../types';
import { ImageConfig } from 'konva/lib/shapes/Image';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { imageCache } from './image-cache';

export function aiTableTextConfigToKonvaConfig(textConfig: AITableText, rowHeight: number): TextConfig {
    const result: TextConfig = {
        x: textConfig.x,
        y: textConfig.y,
        text: textConfig.text,
        fill: textConfig.fillStyle,
        fontStyle: textConfig.fontWeight,
        fontSize: textConfig.fontSize,
        align: textConfig.textAlign,
        height: 0,
        verticalAlign: textConfig.verticalAlign,
        textDecoration: textConfig.textDecoration,
        wrap: textConfig.wrap,
        ellipsis: textConfig.ellipsis
    };
    return result;
}

export function aiTableImageConfigToKonvaConfig(
    imageConfig: Partial<AITableImage>,
    options: {
        listening?: boolean;
    }
): ImageConfig {
    let image = imageCache.getImage(imageConfig.url!);
    if (!image) {
        const img = new Image();
        img.src = imageConfig.url!;
        image = img;
    }
    const result: ImageConfig = {
        ...imageConfig,
        listening: options?.listening,
        image: image as HTMLImageElement
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
