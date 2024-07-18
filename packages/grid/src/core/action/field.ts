import { ActionName, AddFieldAction, AIFieldPath, AITable, AITableField } from '../types';

export function addField(aiTable: AITable, field: AITableField, path: AIFieldPath) {
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
