import { ActionName, AddFieldAction, FieldPath, AITable, AITableField } from '../types';

export function addField(aiTable: AITable, field: AITableField, path: [FieldPath]) {
    const operation: AddFieldAction = {
        type: ActionName.AddField,
        field,
        path
    };
    aiTable.apply(operation);
}

export const FieldActions = {
    addField
};
