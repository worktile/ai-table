import { ActionName, AddFieldAction, AIFieldPath, AITable, AITableField, RemoveFieldAction } from '../types';

export function addField(aiTable: AITable, field: AITableField, path: AIFieldPath) {
    const operation: AddFieldAction = {
        type: ActionName.AddField,
        field,
        path
    };
    aiTable.apply(operation);
}

export function removeField(aiTable: AITable, path: AIFieldPath) {
    const operation: RemoveFieldAction = {
        type: ActionName.RemoveField,
        path
    };
    aiTable.apply(operation);
}

export const FieldActions = {
    addField,
    removeField
};
