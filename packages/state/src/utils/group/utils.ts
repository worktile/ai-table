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
