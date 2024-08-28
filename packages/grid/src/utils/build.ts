import { AITableFields, AITableRecords, FieldOptions } from '../core';
import { AITableGridData } from '../types';

export const buildGridData = (recordValue: AITableRecords, fieldsValue: AITableFields): AITableGridData => {
    const fields = fieldsValue.map((value) => {
        const fieldOption = FieldOptions.find(item=> item.type === value.type)!;
        return {
            ...value,
            icon: value.icon || fieldOption.icon,
            width: value.width || fieldOption.width
        };
    });
    return {
        type: 'grid',
        fields,
        records: recordValue
    };
};
