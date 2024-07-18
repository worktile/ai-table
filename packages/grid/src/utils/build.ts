import { AITableFields, AITableRecords } from '../core';
import { AITableGridData } from '../types';

export const buildGridData = (recordValue: AITableRecords, fieldsValue: AITableFields): AITableGridData => {
    return {
        type: 'grid',
        fields: fieldsValue,
        records: recordValue.map((item) => {
            return { ...item, checked: false };
        })
    };
};
