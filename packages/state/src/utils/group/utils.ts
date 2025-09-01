import { AITableLinearRowGroup, AITableRowType } from '@ai-table/grid';
import { AIViewTable } from '../../types';

export function getParentLinearRowGroups(aiTable: AIViewTable, targetId: string) {
    const linearRows = aiTable.context!.linearRows();
    const targetIndex = aiTable.context!.visibleRowsIndexMap().get(targetId)!;

    if (targetIndex === -1) {
        return [];
    }

    const targetRow = linearRows[targetIndex];
    const maxParentDepth = targetRow.depth || 0;

    // 没有需要查找的父级深度，直接返回
    if (maxParentDepth < 0) {
        return [];
    }

    const parentGroups: AITableLinearRowGroup[] = [];
    for (let i = targetIndex - 1; i >= 0 && parentGroups.length <= maxParentDepth; i--) {
        const row = linearRows[i];

        if (row.type === AITableRowType.group) {
            const rowDepth = row.depth || 0;

            // 如果是需要的父级深度，且还没有找到该深度的分组
            if (rowDepth <= maxParentDepth && !parentGroups.some((g) => (g.depth || 0) === rowDepth)) {
                parentGroups.push(row);
            }
        }
    }

    return parentGroups;
}
