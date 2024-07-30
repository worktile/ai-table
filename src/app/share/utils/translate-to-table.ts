import { AITableFields, AITableRecords, Path } from '@ai-table/grid';
import { SharedType } from '../shared';

export const translateRecord = (arrayRecord: any[], fields: AITableFields) => {
    const fieldIds = fields.map((item) => item.id);
    const recordValue: Record<string, any> = {};
    fieldIds.forEach((item, index) => {
        recordValue[item] = arrayRecord[index] || '';
    });
    return recordValue;
};

export const translateSharedTypeToTable = (sharedType: SharedType) => {
    const data = sharedType.toJSON();
    const fields: AITableFields = data['fields'];
    const records: AITableRecords = data['records'].map((record: any) => {
        const [fixedField, customField] = record;
        return {
            id: fixedField[0],
            value: translateRecord(customField, fields)
        };
    });
    const views = data['views']
    return {
        records,
        fields,
        views
    };
};

export function toTablePath(path: (string | number)[]): Path {
    return path.filter((node) => typeof node === 'number') as Path;
}
