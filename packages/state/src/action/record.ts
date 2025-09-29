import { AITableQueries, FieldModelMap } from '@ai-table/grid';
import {
    UpdateFieldValueAction,
    ActionName,
    AddRecordAction,
    RemoveRecordAction,
    UpdateSystemFieldValue,
    AITableRecord,
    IdPath,
    AITableViewRecords,
    AITableViewRecord,
    AddRecordOptions,
    UpdateFieldValueOptions,
    AITableSystemFieldValueOption
} from '@ai-table/utils';
import { AIViewTable } from '../types/ai-table';
import { getNewItemsPosition, ViewPositionOptions } from '../utils/view-position';
import { PositionsActions } from './position';

export function updateFieldValues(aiTable: AIViewTable, options: UpdateFieldValueOptions[]) {
    let operations: UpdateFieldValueAction[] = [];

    (options || []).forEach((option) => {
        const field = AITableQueries.getField(aiTable, [option.path[1]]);
        const fieldModel = field && FieldModelMap[field.type];
        if (fieldModel && fieldModel.isValid(option.value)) {
            const operation: UpdateFieldValueAction = {
                type: ActionName.UpdateFieldValue,
                newFieldValue: option.value,
                path: option.path
            };

            operations.push(operation);
        } else {
            console.error(
                `Invalid field value at update field value. invalidFieldType: ${field?.type}, value: ${option.value}, field_id: ${option.path[1]}`
            );
        }
    });

    aiTable.apply(operations);
}

export function updateSystemFieldValues(aiTable: AIViewTable, options: AITableSystemFieldValueOption[]) {
    const operations: UpdateSystemFieldValue[] = [];
    (options || []).forEach((option) => {
        const operation: UpdateSystemFieldValue = {
            type: ActionName.UpdateSystemFieldValue,
            updatedInfo: option.updatedInfo,
            path: option.path
        };
        operations.push(operation);
    });

    aiTable.apply(operations);
}

export function addRecord(aiTable: AIViewTable, record: AITableRecord) {
    addRecords(aiTable, [record]);
}

export function addRecords(aiTable: AIViewTable, records: AITableRecord[], options?: AddRecordOptions) {
    const invalidFieldValues: string[] = [];
    const viewPositionOptions: ViewPositionOptions = {
        afterItemId: options?.afterRecordId,
        beforeItemId: options?.beforeRecordId,
        count: options?.count
    };
    let positions = getNewItemsPosition(aiTable, viewPositionOptions, aiTable.records() as AITableViewRecord[], aiTable.recordsMap());
    if (positions.length === 0) {
        PositionsActions.resetAllRecordsPositions(aiTable);
        positions = getNewItemsPosition(aiTable, viewPositionOptions, aiTable.records() as AITableViewRecord[], aiTable.recordsMap());
        console.log('Reset all records positions');
    }
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
    removeRecord,
    updateFieldValues,
    updateSystemFieldValues
};
