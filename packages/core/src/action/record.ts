import { ActionName, AddRecordAction, RecordPath, VTable, VTableRecord } from '../types';

export function addRecord(vTable: VTable, record: VTableRecord, path: [RecordPath]) {
    const operation: AddRecordAction = {
        type: ActionName.AddRecord,
        record,
        path
    };
    vTable.apply(operation);
}

export const RecordActions = {
    addRecord
};
