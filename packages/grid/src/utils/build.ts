import { AITable, getFieldOptions } from '../core';
import { AITableGridData, AITableLinearRow } from '../types';
import { AITableRowType } from '../types/row';
import { AITableFields, AITableRecords } from '@ai-table/utils';

export const buildGridLinearRows = (
    visibleRecords: AITableRecords,
    isAddingVisible: boolean = true,
    aiTable?: AITable,
    aiBuildGroupLinearRowsFn?: (aiTable: AITable) => AITableLinearRow[] | null
): AITableLinearRow[] => {
    if (aiBuildGroupLinearRowsFn) {
        const groupLinearRows = aiBuildGroupLinearRowsFn(aiTable!);
        if (groupLinearRows) {
            return groupLinearRows;
        }
    }
    return buildNormalLinearRows(visibleRecords, isAddingVisible);
};

export const buildNormalLinearRows = (visibleRecords: AITableRecords, isAddingVisible: boolean = true): AITableLinearRow[] => {
    let linearRows: AITableLinearRow[] = [];
    let displayRowIndex = 0;
    [...visibleRecords, { _id: '' }].forEach((row) => {
        if (row._id) {
            displayRowIndex++;
            linearRows.push({
                type: AITableRowType.record,
                _id: row._id,
                displayIndex: displayRowIndex,
                depth: 0
            });
        }
        if (isAddingVisible && !row._id) {
            linearRows.push({
                type: AITableRowType.add,
                _id: '',
                depth: 0
            });
        }
    });
    return linearRows;
};
