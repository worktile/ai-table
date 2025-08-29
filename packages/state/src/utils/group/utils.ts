import { AITableLinearRowGroup, AITableRowType } from '@ai-table/grid';
import { AIViewTable } from '../../types';

export function getParentLinearRowGroups(aiTable: AIViewTable, groupId: string) {
    const parentGroups: AITableLinearRowGroup[] = [];
    const linearRows = aiTable.context!.linearRows();
    let groupIndex = linearRows.findIndex((row) => row._id === groupId);
    if (groupIndex > -1) {
        const currentRow = linearRows[groupIndex];
        let isBreak = false;
        while (!isBreak) {
            const groupRow = linearRows[groupIndex];
            if (groupRow.depth === currentRow.depth || groupRow.type === AITableRowType.group) {
                if (groupRow.type === AITableRowType.group) {
                    parentGroups.push(groupRow);
                }
                groupIndex--;
            } else {
                isBreak = true;
            }
        }
    }
    return parentGroups;
}

export function getGridDataRecordIndexByLinearRowIndex(aiTable: AIViewTable, targetRowIndex: number) {
    const linearRows = aiTable.context!.linearRows();
    const records = aiTable.gridData().records;
    const linearRowRecord = linearRows[targetRowIndex];
    if (linearRowRecord.type === AITableRowType.record) {
        return records.findIndex((record) => record._id === linearRowRecord._id);
    }
    if (linearRowRecord.type === AITableRowType.add) {
        return linearRowRecord.range ? linearRowRecord.range[1] + 1 : targetRowIndex;
    }
    return targetRowIndex;
}

export function getLinearRowTypeByLinerRowIndex(aiTable: AIViewTable, index: number) {
    const linearRows = aiTable.context!.linearRows();
    return linearRows[index].type;
}
