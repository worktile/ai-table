import {
    AIRecordFieldIdPath,
    AITableQueries,
    AITableRecord,
    AITableRecordUpdatedInfo,
    FieldModelMap,
    IdPath,
    NumberPath
} from '@ai-table/grid';
import {
    UpdateFieldValueAction,
    ActionName,
    AddRecordAction,
    MoveRecordAction,
    RemoveRecordAction,
    AIViewTable,
    UpdateSystemFieldValue
} from '../types';

export function updateFieldValue(aiTable: AIViewTable, value: any, path: AIRecordFieldIdPath) {
    const oldValue = AITableQueries.getFieldValue(aiTable, path);
    const field = AITableQueries.getField(aiTable, [path[1]]);
    const fieldModel = field && FieldModelMap[field.type];
    if (fieldModel && fieldModel.isValid(value)) {
        const operation: UpdateFieldValueAction = {
            type: ActionName.UpdateFieldValue,
            fieldValue: oldValue,
            newFieldValue: value,
            path
        };
        aiTable.apply(operation);
    }
}

export function updateSystemFieldValue(aiTable: AIViewTable, path: IdPath, updatedInfo: AITableRecordUpdatedInfo) {
    const operation: UpdateSystemFieldValue = {
        type: ActionName.UpdateSystemFieldValue,
        updatedInfo,
        path
    };
    aiTable.apply(operation);
}

export function addRecord(aiTable: AIViewTable, record: AITableRecord, path: NumberPath) {
    // TODO: 对 record 的值进行验证
    const operation: AddRecordAction = {
        type: ActionName.AddRecord,
        record,
        path
    };
    aiTable.apply(operation);
}

export function moveRecord(aiTable: AIViewTable, path: NumberPath, newPath: NumberPath) {
    const operation: MoveRecordAction = {
        type: ActionName.MoveRecord,
        path,
        newPath
    };
    aiTable.apply(operation);
}

export function removeRecord(aiTable: AIViewTable, path: IdPath) {
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
    removeRecord,
    updateSystemFieldValue
};
