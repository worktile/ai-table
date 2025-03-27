import { AITableField, AITableFields, AITableRecordUpdatedInfo, MoveFieldOptions, NumberPath } from '@ai-table/grid';
import { AITableViewField, AIViewTable } from '../../types';
import { Actions } from '../../action';
import { updateRecordsUpdatedInfo } from '../record/update-system-field-value';

export function moveFields(aiTable: AIViewTable, options: MoveFieldOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const { path, newPath } = options;
    Actions.moveField(aiTable, path, newPath);
}

export function updateFieldPositionInView(
    viewId: string,
    fields: AITableFields,
    sourceField: AITableField,
    targetField: AITableField,
    path: NumberPath,
    newPath: NumberPath
) {
    const targetPosition = (targetField as AITableViewField).positions[viewId];
    let calculatePosition = 0;
    if (path[0] > newPath[0]) {
        const prevPath = newPath[0] - 1;
        let targetPrevPosition = 0;
        if (prevPath > 0) {
            const targetPrevField = fields[prevPath];
            targetPrevPosition = (targetPrevField as AITableViewField).positions[viewId];
            calculatePosition = (targetPosition + targetPrevPosition) / 2;
        } else {
            const targetPrevField = fields[0];
            calculatePosition = (targetPrevField as AITableViewField).positions[viewId] - 0.1;
        }
    } else {
        const nextPath = newPath[0] + 1;
        let targetNextPosition = 0;
        if (fields.length > nextPath) {
            const targetNextField = fields[nextPath];
            targetNextPosition = (targetNextField as AITableViewField).positions[viewId];
        } else {
            const targetNextField = fields[fields.length - 1];
            targetNextPosition = (targetNextField as AITableViewField).positions[viewId] + 1;
            calculatePosition = targetNextPosition;
        }
        calculatePosition = (targetPosition + targetNextPosition) / 2;
    }
    (sourceField as AITableViewField).positions[viewId] = calculatePosition;
}
