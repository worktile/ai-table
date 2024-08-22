import { AITableFields, AITableRecords } from '@ai-table/grid';
import { SharedType } from '../../types';
import { translateToRecords } from './translate';

export const initTable = (sharedType: SharedType) => {
    const data = sharedType.toJSON();
    const fields: AITableFields = data['fields'];
    const records: AITableRecords = translateToRecords(data['records'], fields);
    const views = data['views'];
    return {
        records,
        fields,
        views
    };
};
