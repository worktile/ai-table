import { ActionName, AddRecordAction, FieldPath, RecordPath, UpdateFieldValueAction, VTable, VTableRecord } from '../types';
import { VTableQueries } from '../utils';

export function updateFieldValue(vTable: VTable, value: any, path: [RecordPath, FieldPath]) {
    const node = VTableQueries.getFieldValue(vTable, path);
    if (node !== value) {
        const operation: UpdateFieldValueAction = {
            type: ActionName.UpdateFieldValue,
            fieldValue: node,
            newFieldValue: value,
            path
        };
        vTable.apply(operation);
    }
}

export function addRecord(vTable: VTable, record: VTableRecord, path: [RecordPath]) {
    const operation: AddRecordAction = {
        type: ActionName.AddRecord,
        record,
        path
    };
    vTable.apply(operation);
}

export const RecordActions = {
    addRecord,
    updateFieldValue
};
