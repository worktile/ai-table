import { ActionName, AddRecordAction, FieldPath, RecordPath, UpdateFieldValueAction, VTable, VTableNode, VTableRecord } from '../types';

export function updateFieldValue(vTable: VTable, value: any, path: [RecordPath, FieldPath]) {
    const node = VTableNode.get(vTable, path);
    if (node !== value) {
        const operation: UpdateFieldValueAction = {
            type: ActionName.UpdateFieldValue,
            fieldValue: node,
            newFieldValue: value,
            path
        };
        vTable.applyRecords(operation);
    }
}

export function addRecord(vTable: VTable, record: VTableRecord, path: [RecordPath]) {
    const operation: AddRecordAction = {
        type: ActionName.AddRecord,
        record,
        path
    };
    vTable.applyRecords(operation);
}

export const RecordActions = {
    addRecord,
    updateFieldValue
};
