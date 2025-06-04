import { TextConfig } from 'konva/lib/shapes/Text';
import { AITable } from '../core';
import { ComponentMap } from '../renderer/components/cells/cells';
import { AITableImage, AITableRect, AITableText } from '../types';
import { getDetailByTargetName } from './common';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { ImageConfig } from 'konva/lib/shapes/Image';

export function getHoverCell(aiTable: AITable) {
    const pointPosition = aiTable.context!.pointPosition();
    const { fieldId, recordId } = getDetailByTargetName(pointPosition.realTargetName!) ?? {};
    if (!recordId || !fieldId) {
        return;
    }
    const record = aiTable.recordsMap()[recordId!];
    const field = aiTable.fieldsMap()[fieldId!];

    if (!record || !field || !recordId || !fieldId) {
        return;
    }

    const renderComponentDefinition = ComponentMap[field?.type];
    if (!renderComponentDefinition) {
        return;
    }
    return {
        field,
        recordId,
        fieldId,
        renderComponentDefinition
    };
}

export function transformTextCanvasToKonva(textConfig: AITableText, rowHeight: number): TextConfig {
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

export function transformImageCanvasToKonva(
    imageConfig: Partial<AITableImage>,
    options: {
        listening?: boolean;
    }
): ImageConfig {
    const img = new Image();
    img.src = imageConfig.url!;
    const result: ImageConfig = {
        ...imageConfig,
        listening: options?.listening ?? false,
        image: img
    };
    return result;
}

export function transformRectCanvasToKonva(
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
