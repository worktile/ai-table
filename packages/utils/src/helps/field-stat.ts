import { isEmpty } from '../public-api';
import { AITableField, AITableRecords } from '../types';

export function countAll(records: AITableRecords, field: AITableField) {
    return records.length;
}

export function countEmpty(records: AITableRecords, field: AITableField) {
    return records.filter((record) => {
        const fieldValue = record.values[field._id];
        if (isEmpty(fieldValue)) {
            return true;
        }
        return false;
    }).length;
}

export function countFilled(records: AITableRecords, field: AITableField) {
    return records.filter((record) => {
        const fieldValue = record.values[field._id];
        if (isEmpty(fieldValue)) {
            return false;
        }
        return true;
    }).length;
}
