import { Path } from '@ai-table/grid';
import { AITableViewFields, SyncArrayElement, SyncElement, SyncMapElement } from '../../types';
import * as Y from 'yjs';

export const translateToRecordValues = (arrayRecord: any[], fields: AITableViewFields) => {
    const fieldIds = fields.map((item) => item._id);
    const recordValue: Record<string, any> = {};
    fieldIds.forEach((item, index) => {
        recordValue[item] = arrayRecord[index] || '';
    });
    return recordValue;
};

export const translateToRecords = (arrayRecords: any[], fields: AITableViewFields) => {
    return arrayRecords.map((record: any) => {
        const [nonEditableArray, editableArray] = record;
        return {
            _id: nonEditableArray[0],
            positions: editableArray[editableArray.length - 1],
            values: translateToRecordValues(editableArray.slice(0, editableArray.length - 1), fields)
        };
    });
};

export function toTablePath(path: (string | number)[]): Path {
    return path.filter((node) => typeof node === 'number') as Path;
}

export function getSharedRecordId(records: SyncElement, recordIndex: number) {
    return records && (records as Y.Array<SyncArrayElement>).get(recordIndex).get(0).get(0);
}

export function getSharedFieldId(fields: SyncElement, fieldIndex: number) {
    return fields && (fields as Y.Array<SyncMapElement>).get(fieldIndex).get('_id');
}
