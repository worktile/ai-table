import { ActionName, AddRecordAction, FieldPath, RecordPath, UpdateFieldValueAction, AITable, AITableRecord } from '../types';
import { AITableQueries } from '../utils';

export function updateFieldValue(aiTable: AITable, value: any, path: [RecordPath, FieldPath]) {
    const node = AITableQueries.getFieldValue(aiTable, path);
    if (node !== value) {
        const operation: UpdateFieldValueAction = {
            type: ActionName.UpdateFieldValue,
            fieldValue: node,
            newFieldValue: value,
            path
        };
        aiTable.apply(operation);
    }
}

export function addRecord(aiTable: AITable, record: AITableRecord, path: [RecordPath]) {
    const operation: AddRecordAction = {
        type: ActionName.AddRecord,
        record,
        path
    };
    aiTable.apply(operation);
}

export const RecordActions = {
    addRecord,
    updateFieldValue
};
