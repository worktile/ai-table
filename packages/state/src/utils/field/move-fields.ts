import { AITableField, AITableFields, AITableRecordUpdatedInfo, MoveFieldOptions, NumberPath } from '@ai-table/grid';
import { AITableViewField, AIViewTable } from '../../types';
import { Actions } from '../../action';

export function moveFields(aiTable: AIViewTable, options: MoveFieldOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const { path, newPath } = options;
    Actions.moveField(aiTable, path, newPath);
}

export function getFieldPositionInView(viewId: string, fields: AITableFields, path: NumberPath, newPath: NumberPath) {
    const targetPosition = (fields[newPath[0]] as AITableViewField).positions[viewId];
    let newPosition = 0;
    if (path[0] > newPath[0]) {
        const prevPath = newPath[0] - 1;
        if (prevPath > 0) {
            const targetPrevField = fields[prevPath];
            const targetPrevPosition = (targetPrevField as AITableViewField).positions[viewId];
            newPosition = (targetPosition + targetPrevPosition) / 2;
        } else {
            const firstField = fields[0];
            newPosition = (firstField as AITableViewField).positions[viewId] - 0.1;
        }
    } else {
        const nextPath = newPath[0] + 1;
        if (fields.length > nextPath) {
            const targetNextField = fields[nextPath];
            const targetNextPosition = (targetNextField as AITableViewField).positions[viewId];
            newPosition = (targetPosition + targetNextPosition) / 2;
        } else {
            const lastField = fields[fields.length - 1];
            newPosition = (lastField as AITableViewField).positions[viewId] + 1;
        }
    }
    return newPosition;
}
