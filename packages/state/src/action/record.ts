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
    } else {
        console.error(
            `Invalid field value at update field value. invalidFieldValue: ${field?.type}, value: ${value}, field_id: ${path[1]}`
        );
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
    const invalidFieldValues: string[] = [];
    const isValid = Object.entries(record.values).every(([fieldId, value]) => {
        const field = AITableQueries.getField(aiTable, [fieldId]);
        const fieldModel = field && FieldModelMap[field.type];
        const result = fieldModel ? fieldModel.isValid(value) : false;
        if (!result) {
            invalidFieldValues.push(`field_id: ${fieldId}, field_type: ${field?.type}, value: ${value}`);
        }
        return result;
    });
    if (isValid) {
        const operation: AddRecordAction = {
            type: ActionName.AddRecord,
            record,
            path
        };
        aiTable.apply(operation);
    } else {
        console.error(`Invalid field values at add record. invalidFieldValues: ${invalidFieldValues}`);
    }
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
