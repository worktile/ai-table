import { AITableFields, AITableRecords } from '../core';
import { AITableGridData, AITableSelection } from '../types';

export const buildGridData = (recordValue: AITableRecords, fieldsValue: AITableFields, selection: AITableSelection): AITableGridData => {
    return {
        type: 'grid',
        fields: fieldsValue,
        records: recordValue.map((item) => {
            return { ...item, checked: selection.selectedRecords.has(item.id) };
        })
    };
};
