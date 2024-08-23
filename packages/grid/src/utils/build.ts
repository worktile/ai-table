import { AITableFields, AITableRecords, FieldsMap } from '../core';
import { AITableLinearRow } from '../types';
import { AITableRowType } from '../types/record';

export const buildGridLinearRows = (visibleRecords: AITableRecords): AITableLinearRow[] => {
    const linearRows: AITableLinearRow[] = [];
    let preRow = { _id: '' };
    let displayRowIndex = 0;
    for (const [index, row] of [...visibleRecords, { _id: '' }].entries()) {
        preRow = row;
        if (row._id) {
            displayRowIndex++;
            linearRows.push({
                type: AITableRowType.record,
                depth: 0,
                recordId: row._id,
                displayIndex: displayRowIndex,
                groupHeadRecordId: ''
            });
        }
        if (!row._id) {
            linearRows.push({
                type: AITableRowType.add,
                depth: 0,
                recordId: ''
            });
        }
    }
    return linearRows;
};

export const buildGridData = (recordValue: AITableRecords, fieldsValue: AITableFields) => {
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
