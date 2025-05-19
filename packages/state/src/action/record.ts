import { AITableQueries, FieldModelMap } from '@ai-table/grid';
import {
    UpdateFieldValueAction,
    ActionName,
    AddRecordAction,
    RemoveRecordAction,
    UpdateSystemFieldValue,
    AIRecordFieldIdPath,
    AITableRecord,
    AITableRecordUpdatedInfo,
    IdPath,
    AITableViewRecords,
    AITableViewRecord,
    AddRecordOptions
} from '@ai-table/utils';
import { AIViewTable } from '../types/ai-table';
import { createMultipleDefaultPositions, getPositions, getSortRecords } from '../utils';

export function updateFieldValue(aiTable: AIViewTable, value: any, path: AIRecordFieldIdPath) {
    const field = AITableQueries.getField(aiTable, [path[1]]);
    const fieldModel = field && FieldModelMap[field.type];
    if (fieldModel && fieldModel.isValid(value)) {
        const operation: UpdateFieldValueAction = {
            type: ActionName.UpdateFieldValue,
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
    addRecords(aiTable, [record]);
}

export function addRecords(
    aiTable: AIViewTable,
    records: AITableRecord[],
    options?: AddRecordOptions & {
        sortRecords?: AITableViewRecords;
    }
) {
    const invalidFieldValues: string[] = [];

    const sortRecords =
        options?.sortRecords ||
        (getSortRecords(
            aiTable,
            aiTable.records() as AITableViewRecords,
            aiTable.views().find((item) => item._id === aiTable.activeViewId())!
        ) as AITableViewRecords);
    const targetIndex = options?.targetId
        ? sortRecords.findIndex((item) => item._id === options.targetId)
        : options?.targetIndex || sortRecords.length - 1;
    const positions = createMultipleDefaultPositions(
        aiTable.views(),
        aiTable.activeViewId(),
        sortRecords,
        targetIndex,
        records.length,
        options?.isInsertBefore
    );
    records.forEach((record, index) => {
        Object.entries(record.values).every(([fieldId, value]) => {
            const field = AITableQueries.getField(aiTable, [fieldId]);
            const fieldModel = field && FieldModelMap[field.type];
            const result = fieldModel ? fieldModel.isValid(value) : false;
            if (!result) {
                invalidFieldValues.push(`field_id: ${fieldId}, field_type: ${field?.type}, value: ${value}`);
            }
            return result;
        });
    });
    if (invalidFieldValues.length) {
        console.error(`Invalid field values at add records. invalidFieldValues: ${invalidFieldValues}`);
        return;
    }

    records.forEach((record, index) => {
        (record as AITableViewRecord).positions = positions[index];
        const operation: AddRecordAction = {
            type: ActionName.AddRecord,
            record
        };
        aiTable.apply(operation);
    });
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
    addRecords,
    updateFieldValue,
    removeRecord,
    updateSystemFieldValue
};
