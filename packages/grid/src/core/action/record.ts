import {
    ActionName,
    AddRecordAction,
    AIRecordPath,
    UpdateFieldValueAction,
    AITable,
    AITableRecord,
    AIFieldValuePath,
    MoveFieldAction,
    MoveRecordAction
} from '../types';
import { AITableQueries } from '../utils';

export function updateFieldValue(aiTable: AITable, value: any, path: AIFieldValuePath) {
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

export function addRecord(aiTable: AITable, record: AITableRecord, path: AIRecordPath) {
    const operation: AddRecordAction = {
        type: ActionName.AddRecord,
        record,
        path
    };
    aiTable.apply(operation);
}

export function moveRecord(aiTable: AITable, newPath: AIRecordPath, path: AIRecordPath) {
    const operation: MoveRecordAction = {
        type: ActionName.MoveRecord,
        newPath,
        path
    };
    aiTable.apply(operation);
}

export const RecordActions = {
    addRecord,
    updateFieldValue,
    moveRecord
};
