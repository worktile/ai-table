import {
    ActionName,
    AddRecordAction,
    AIRecordPath,
    UpdateFieldValueAction,
    AITable,
    AITableRecord,
    AIFieldValuePath,
    RemoveRecordAction
} from '../types';
import { AITableQueries } from '../utils';

export function updateFieldValue(aiTable: AITable, value: any, path: AIFieldValuePath) {
    const field = AITableQueries.getFieldValue(aiTable, path);
    if (field !== value) {
        const operation: UpdateFieldValueAction = {
            type: ActionName.UpdateFieldValue,
            fieldValue: field,
            newFieldValue: value,
            path
        };
        aiTable.apply(operation);
    }
}

export function addRecord(aiTable: AITable, record: AITableRecord, path: AIRecordPath) {
    const operation: AddRecordAction = {
        type: ActionName.AddRecord,
        record,
        path
    };
    aiTable.apply(operation);
}

export function removeRecord(aiTable: AITable, path: AIRecordPath) {
    const operation: RemoveRecordAction = {
        type: ActionName.RemoveRecord,
        path
    };
    aiTable.apply(operation);
}

export const RecordActions = {
    addRecord,
    updateFieldValue,
    removeRecord
};
