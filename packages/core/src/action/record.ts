import { ActionName, AddRecordAction, FieldPath, RecordPath, UpdateFieldValueAction, VTable, VTableNode, VTableRecord } from '../types';

export function updateFieldValue(vTable: VTable, props: { value: any }, path: [RecordPath, FieldPath]) {
    const node = VTableNode.get(vTable, path);
    if (node !== props.value) {
        const properties = {
            value: node
        };
        const newProperties = props;
        const operation: UpdateFieldValueAction = {
            type: ActionName.UpdateFieldValue,
            properties,
            newProperties,
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
