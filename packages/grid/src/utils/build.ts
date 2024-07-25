import { AITableFields, AITableRecords, FieldsMap } from '../core';
import { AITableGridData, AITableSelection } from '../types';

export const buildGridData = (recordValue: AITableRecords, fieldsValue: AITableFields, selection: AITableSelection): AITableGridData => {
    return {
        type: 'grid',
        fields: fieldsValue.map(item=>{
            return {
                ...item,
                icon: item.icon || FieldsMap[item.type].icon,
                width: item.width || FieldsMap[item.type].width
            }
        }),
        records: recordValue.map((item) => {
            return { ...item, checked: selection.selectedRecords.has(item.id) };
        })
    };
};
