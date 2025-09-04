import { AITableLinearRowGroup, AITableRowType } from '@ai-table/grid';
import { AIViewTable } from '../../types';

export function getParentLinearRowGroups(aiTable: AIViewTable, targetId: string) {
    const linearRows = aiTable.context!.linearRows();
    const targetIndex = aiTable.context!.visibleRowsIndexMap().get(targetId)!;

    if (targetIndex === -1) {
        return [];
    }

    const targetRow = linearRows[targetIndex];

    const parentGroups: AITableLinearRowGroup[] = [];
    let parentDepthPointer = targetRow.depth! - 1;
    for (let i = targetIndex - 1; i >= 0 && parentDepthPointer >= 0; i--) {
        const row = linearRows[i];

        if (row.type === AITableRowType.group) {
            const rowDepth = row.depth || 0;

            if (rowDepth <= parentDepthPointer) {
                parentGroups.push(row);
                parentDepthPointer--;
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
