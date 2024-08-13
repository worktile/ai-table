import { Path } from '@ai-table/grid';
import { AITableViewFields, AITableViewRecords, SharedType } from '../../types';
import { translateToRecords } from './translate';

export const initTable = (sharedType: SharedType) => {
    const data = sharedType.toJSON();
    const fields: AITableViewFields = data['fields'];
    const records: AITableViewRecords = translateToRecords(data['records'], fields);
    const views = data['views'];
    return {
        records,
        fields,
        views
    };
};


export function toTablePath(path: (string | number)[]): Path {
    return path.filter((node) => typeof node === 'number') as Path;
}
