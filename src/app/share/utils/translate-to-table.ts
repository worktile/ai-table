import { AITableFields, Path } from '@ai-table/grid';
import { SharedType } from '../shared';
import { DemoAIField, DemoAIRecord } from '../../types';
import { Doc } from 'yjs';

export const translateRecord = (arrayRecord: any[], fields: AITableFields) => {
    const fieldIds = fields.map((item) => item._id);
    const recordValue: Record<string, any> = {};
    fieldIds.forEach((item, index) => {
        recordValue[item] = arrayRecord[index] || '';
    });
    return recordValue;
};

export const translateSharedTypeToTable = (sharedType: SharedType) => {
    const data = sharedType.toJSON();
    const fields: DemoAIField[] = data['fields'];
    const views = data['views'];
    return {
        fields,
        views
    };
};

export function toTablePath(path: (string | number)[]): Path {
    return path.filter((node) => typeof node === 'number') as Path;
}
