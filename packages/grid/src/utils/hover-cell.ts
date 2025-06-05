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
