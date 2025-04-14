import { AITable } from '../core';
import { componentMap } from '../renderer/components/cells/cells';
import { getDetailByTargetName } from './common';

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
