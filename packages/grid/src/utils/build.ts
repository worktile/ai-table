import { AITableFields, AITableRecords, FieldsMap } from '../core';
import { AITableGridData, AITableLinearRow } from '../types';
import { AITableRowType } from '../types/row';

export const buildGridLinearRows = (visibleRecords: AITableRecords): AITableLinearRow[] => {
    const linearRows: AITableLinearRow[] = [];
    let displayRowIndex = 0;
    [...visibleRecords, { _id: '' }].forEach((row) => {
        if (row._id) {
            displayRowIndex++;
            linearRows.push({
                type: AITableRowType.record,
                _id: row._id,
                displayIndex: displayRowIndex
            });
        }
        if (!row._id) {
            linearRows.push({
                type: AITableRowType.add,
                _id: ''
            });
        }
    });
    return linearRows;
};

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
