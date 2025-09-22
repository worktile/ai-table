import { AITableLinearRow, AITableLinearRowGroup, AITableRowType } from '@ai-table/grid';
import { AIViewTable } from '../../types';
import _ from 'lodash';

export function getParentLinearRowGroups(aiTable: AIViewTable, targetId: string, linearRows?: AITableLinearRow[]) {
    linearRows = linearRows || aiTable.context!.linearRows();
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

    return parentGroups.reverse();
}

export function isSameParentGroup(
    aiTable: AIViewTable,
    recordId: string,
    originGroupLinearRows: AITableLinearRow[],
    tmpNewGroupLinearRows: AITableLinearRow[]
) {
    const originalParentLinearRowGroups = getParentLinearRowGroups(aiTable, recordId, originGroupLinearRows);
    const newParentLinearRowGroups = getParentLinearRowGroups(aiTable, recordId, tmpNewGroupLinearRows);
    return _.join(_.map(originalParentLinearRowGroups, 'groupValue'), ':') !== _.join(_.map(newParentLinearRowGroups, 'groupValue'), ':');
}

export function getGroupRecordLength(aiTable: AIViewTable, recordId: string, linearRows?: AITableLinearRow[]) {
    const parentLinearRowGroups = getParentLinearRowGroups(aiTable, recordId, linearRows);
    const parentGroup = parentLinearRowGroups[parentLinearRowGroups.length - 1];
    if (parentGroup && parentGroup.range) {
        return parentGroup.range[1] - parentGroup.range[0] + 1;
    }
    return 0;
}
