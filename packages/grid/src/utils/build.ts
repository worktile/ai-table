import { AITableFields, AITableRecords, FieldsMap } from '../core';
import { AITableGroupInfo, AITableLinearRow } from '../types';
import { AITableRowType } from '../types/record';

export const buildGridLinearRows = (visibleRecords: AITableRecords, groupInfo: AITableGroupInfo[] = []): AITableLinearRow[] => {
    const linearRows: AITableLinearRow[] = [];
    const groupLevel = groupInfo.length;
    let preRow = { _id: '' };
    let displayRowIndex = 0;
    if (!visibleRecords.length && groupLevel) {
        linearRows.push({
            type: AITableRowType.Blank,
            depth: 0,
            recordId: ''
        });
        linearRows.push({
            type: AITableRowType.Add,
            depth: 0,
            recordId: ''
        });
    }
    for (const [index, row] of [...visibleRecords, { _id: '' }].entries()) {
        preRow = row;
        if (row._id) {
            displayRowIndex++;
            linearRows.push({
                type: AITableRowType.Record,
                depth: groupLevel,
                recordId: row._id,
                displayIndex: displayRowIndex,
                groupHeadRecordId: ''
            });
        }
        if (!groupLevel && !row._id) {
            linearRows.push({
                type: AITableRowType.Add,
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
