import {
    ActionName,
    AddRecordAction,
    AIRecordPath,
    UpdateFieldValueAction,
    AITable,
    AITableRecord,
    AIFieldValueIdPath,
    MoveRecordAction,
    RemoveRecordAction,
    AIRecordIdPath
} from '../types';
import { AITableQueries } from '../utils';

export function updateFieldValue(aiTable: AITable, value: any, path: AIFieldValueIdPath) {
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

export function moveRecord(aiTable: AITable, path: AIRecordPath, newPath: AIRecordPath) {
    const operation: MoveRecordAction = {
        type: ActionName.MoveRecord,
        path,
        newPath
    };
    aiTable.apply(operation);
}

export function removeRecord(aiTable: AITable, path: AIRecordIdPath) {
    const operation: RemoveRecordAction = {
        type: ActionName.RemoveRecord,
        path
    };
    aiTable.apply(operation);
}

export const RecordActions = {
    addRecord,
    updateFieldValue,
    moveRecord,
    removeRecord
};
