import { AITable, AITableQueries } from '../core';
import { componentMap } from '../renderer/components/cells/cells';
import { transformCellValue } from './cell';
import { getDetailByTargetName } from './common';

export function getHoverCell(aiTable: AITable) {
    const pointPosition = aiTable.context!.pointPosition();
    const { fieldId, recordId } = getDetailByTargetName(pointPosition.realTargetName!) ?? {};
    if (!recordId || !fieldId) {
        return;
    }
    const field = aiTable.fieldsMap()[fieldId!];

    if (!field || !recordId || !fieldId) {
        return;
    }
    const cellValue = AITableQueries.getFieldValue(aiTable, [recordId, fieldId]);
    const transformValue = transformCellValue(aiTable, field, cellValue) || {};
    if (Object.keys(transformValue).length === 0) {
        return;
    }

    const renderComponentDefinition = componentMap[field?.type];
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
