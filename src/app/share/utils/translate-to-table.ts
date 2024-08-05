import { AITableFields, Path } from '@ai-table/grid';
import { SharedType } from '../shared';
import { DemoAIField, DemoAIRecord } from '../../types';

export const translateRecord = (arrayRecord: any[], fields: AITableFields) => {
    const fieldIds = fields.map((item) => item.id);
    const recordValue: Record<string, any> = {};
    fieldIds.forEach((item, index) => {
        recordValue[item] = arrayRecord[index] || '';
    });
    return recordValue;
};

export const translatePositions = (arrayPositions: any[]) => {
    return arrayPositions.reduce((acc, obj) => {
        const key = Object.keys(obj)[0];
        acc[key] = obj[key];
        return acc;
    }, {});
};

export const translateSharedTypeToTable = (sharedType: SharedType) => {
    const data = sharedType.toJSON();
    const fields: DemoAIField[] = data['fields'];
    const records: DemoAIRecord[] = data['records'].map((record: any) => {
        const [fixedField, customField, positions] = record;
        return {
            id: fixedField[0],
            values: translateRecord(customField, fields),
            positions: translatePositions(positions)
        };
    });
    return {
        records,
        fields
    };
};

export function toTablePath(path: (string | number)[]): Path {
    return path.filter((node) => typeof node === 'number') as Path;
}
