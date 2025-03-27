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
    if (path[0] > newPath[0]) {
        const targetPrevField = fields[Math.max(0, newPath[0] - 1)];
        const targetPrevPosition = (targetPrevField as AITableViewField).positions[viewId];
        (sourceField as AITableViewField).positions[viewId] = (targetPosition + targetPrevPosition) / 2;
    } else {
        const targetNextField = fields[Math.min(fields.length - 1, newPath[0] + 1)];
        const targetNextPosition = (targetNextField as AITableViewField).positions[viewId];
        (sourceField as AITableViewField).positions[viewId] = (targetPosition + targetNextPosition) / 2;
    }
}
