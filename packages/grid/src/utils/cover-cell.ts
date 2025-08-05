import { AITable } from '../core';
import { ComponentMap } from '../renderer/components/cells/cells';
import { getDetailByTargetName } from './common';

export function getCoverCell(aiTable: AITable) {
    const pointPosition = aiTable.context!.pointPosition();
    let fieldId;
    let recordId;
    const expandCellPath = aiTable.expendCell()?.path;
    if (expandCellPath && expandCellPath) {
        fieldId = expandCellPath[1];
        recordId = expandCellPath[0];
    } else {
        const { fieldId: fieldIdDetail, recordId: recordIdDetail } = getDetailByTargetName(pointPosition.realTargetName!) ?? {};
        if (fieldIdDetail) {
            fieldId = fieldIdDetail;
        }
        if (recordIdDetail) {
            recordId = recordIdDetail;
        }
    }
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
        isExpand: !!expandCellPath,
        renderComponentDefinition
    };
}
