import {
    ActionName,
    AddRecordAction,
    AIRecordPath,
    UpdateFieldValueAction,
    AITable,
    AITableRecord,
    AIFieldValuePath,
    AITableRecords,
    AITableFields,
    AITableAction
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

export const addRecordFn = (aiTable: AITable, records: AITableRecords, fields: AITableFields, options: AITableAction) => {
    const [recordIndex] = options.path;
    records.splice(recordIndex, 0, (options as any).record);
};

export const updateFieldValueFn = (aiTable: AITable, records: AITableRecords, fields: AITableFields, options: AITableAction) => {
    const [recordIndex, fieldIndex] = options.path;
    const fieldId = aiTable.fields()[fieldIndex as number].id;
    records[recordIndex].value[fieldId] = (options as any).newFieldValue;
};

export const RecordActions = {
    addRecord,
    updateFieldValue,
    addRecordFn,
    updateFieldValueFn
};
