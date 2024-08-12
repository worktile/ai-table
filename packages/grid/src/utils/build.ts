import { AITableFields, AITableRecords, FieldsMap } from '../core';
import { AITableGridData } from '../types';

export const buildGridData = (recordValue: AITableRecords, fieldsValue: AITableFields): AITableGridData => {
    const fields = fieldsValue.map((item) => {
        return {
            ...item,
            icon: item.icon || FieldsMap[item.type].icon,
            width: item.width || FieldsMap[item.type].width
        };
    });
    return {
        type: 'grid',
        fields,
        records: recordValue
    };
};
