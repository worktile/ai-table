import { ActionName, AddFieldAction, AIFieldPath, AITable, AITableAction, AITableField, AITableFields, AITableRecords } from '../types';

export function addField(aiTable: AITable, field: AITableField, path: AIFieldPath) {
    const operation: AddFieldAction = {
        type: ActionName.AddField,
        field,
        path
    };
    aiTable.apply(operation);
}

export const addFieldFn = (aiTable: AITable, records: AITableRecords, fields: AITableFields, options: AITableAction) => {
    const [fieldIndex] = options.path;
    const newField = (options as any).field;
    fields.splice(fieldIndex, 0, newField);
    const newRecord = {
        [newField.id]: ''
    };
    records.forEach((item) => {
        item.value = {
            ...item.value,
            ...newRecord
        };
    });
};

export const FieldActions = {
    addField,
    addFieldFn
};
