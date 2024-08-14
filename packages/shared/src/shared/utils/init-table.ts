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
