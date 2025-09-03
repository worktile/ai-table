import { AITable, AITableLinearRowGroup, AITableRowType } from '@ai-table/grid';
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

export function getGroupLastRecordIndex(aiTable: AITable, startRowIndex: number) {
    const linearRows = aiTable.context!.linearRows();
    if (startRowIndex + 1 >= linearRows.length) {
        return startRowIndex;
    }

    for (let i = startRowIndex + 1; i < linearRows.length; i++) {
        const row = linearRows[i];
        if (row.type !== AITableRowType.record) {
            return i - 1;
        }
    }
    return linearRows.length - 1;
}
