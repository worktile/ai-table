import { AITableQueries, FieldModelMap } from '@ai-table/grid';
import { UpdateFieldValueAction, ActionName, AddRecordAction, RemoveRecordAction, AIViewTable, UpdateSystemFieldValue } from '../types';
import { AIRecordFieldIdPath, AITableRecord, AITableRecordUpdatedInfo, IdPath, NumberPath } from '@ai-table/utils';

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
        console.error(`Invalid field value at update field value. invalidFieldType: ${field?.type}, value: ${value}, field_id: ${path[1]}`);
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

export function addRecord(aiTable: AIViewTable, record: AITableRecord) {
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
            record
        };
        aiTable.apply(operation);
    } else {
        console.error(`Invalid field values at add record. invalidFieldValues: ${invalidFieldValues}`);
    }
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
    removeRecord,
    updateSystemFieldValue
};
