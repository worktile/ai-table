import { ActionName, AddFieldAction, AIFieldPath, AITable, AITableField, MoveFieldAction } from '../types';

export function addField(aiTable: AITable, field: AITableField, path: AIFieldPath) {
    const operation: AddFieldAction = {
        type: ActionName.AddField,
        field,
        path
    };
    aiTable.apply(operation);
}

export function moveField(aiTable: AITable, newPath: AIFieldPath, path: AIFieldPath) {
    const operation: MoveFieldAction = {
        type: ActionName.MoveField,
        newPath,
        path
    };
    aiTable.apply(operation);
}

export const FieldActions = {
    addField,
    moveField
};
