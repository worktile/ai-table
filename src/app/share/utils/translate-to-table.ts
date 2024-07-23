import { Path } from '@ai-table/grid';
import { SharedType } from '../shared';

export const translateRecord = (arrayRecord: []) => {
    const obj: Record<string, any> = {};
    arrayRecord.forEach((item: any) => {
        obj[item.id] = item.fieldValue;
    });

    return obj;
};

export const translateSharedTypeToTable = (sharedType: SharedType) => {
    const data = sharedType.toJSON();
    const records = data['records'].map((record: any) => {
        return {
            id: record.id,
            value: translateRecord(record.value)
        };
    });
    const fields = data['fields'].map((item: any) => {
        const newField = {
            ...item,
            type: Number(item.type)
        };
        if (newField.options) {
            newField.options = Object.values(newField.options);
        }
        return newField;
    });

    return {
        records,
        fields
    };
};

export function toTablePath(path: (string | number)[]): Path {
    return path.filter((node) => typeof node === 'number') as Path;
}
