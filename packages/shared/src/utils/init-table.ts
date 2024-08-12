import { Path } from '@ai-table/grid';
import { AITableSharedFields, AITableSharedRecords } from '../types';
import { SharedType } from '../types/shared';

export const initTable = (sharedType: SharedType) => {
    const data = sharedType.toJSON();
    const fields: AITableSharedFields = data['fields'];
    const records: AITableSharedRecords = data['records'].map((record: any) => {
        const [nonEditableArray, editableArray] = record;
        return {
            _id: nonEditableArray[0],
            positions: editableArray[editableArray.length - 1],
            values: translateRecord(editableArray.slice(0, editableArray.length - 1), fields)
        };
    });
    const views = data['views'];
    return {
        records,
        fields,
        views
    };
};

export const translateRecord = (arrayRecord: any[], fields: AITableSharedFields) => {
    const fieldIds = fields.map((item) => item._id);
    const recordValue: Record<string, any> = {};
    fieldIds.forEach((item, index) => {
        recordValue[item] = arrayRecord[index] || '';
    });
    return recordValue;
};

export function toTablePath(path: (string | number)[]): Path {
    return path.filter((node) => typeof node === 'number') as Path;
}
