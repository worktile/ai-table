import { AITableRecord, AITableViewRecord } from '@ai-table/utils';
import { AIViewTable } from '../../types';
import _ from 'lodash';
import { getParentLinearRowGroups } from '../group/utils';
import { AITableRowType } from '@ai-table/grid';

export function getParentGroupValuesByGroupId(aiTable: AIViewTable, groupId: string): Record<string, any> | null {
    const parentGroups = getParentLinearRowGroups(aiTable, groupId);
    return parentGroups.reduce(
        (pre, cur) => {
            pre[cur.fieldId] = cur.groupValue;
            return pre;
        },
        {} as Record<string, any>
    );
}

export function getPrevRecordIdByAddGroupId(aiTable: AIViewTable, groupId: string) {
    const activeViewId = aiTable.activeViewId();
    const activeView = aiTable.viewsMap()[activeViewId];

    if (!activeView.settings?.groups?.length) return null;

    const visibleRowsIndexMap = aiTable.context!.visibleRowsIndexMap();
    const rowIndex = visibleRowsIndexMap.get(groupId) ?? -1;
    if (rowIndex > -1) {
        const linearRows = aiTable.context!.linearRows();
        const current = linearRows[rowIndex];
        const prev = linearRows[rowIndex - 1];
        if (current.type === AITableRowType.add && prev.type === AITableRowType.record) {
            return prev._id;
        }
        return null;
    }
    return null;
}

export function buildRecordsWithWillMoveRecords(records: AITableRecord[], willMoveRecordsMap: Map<string, AITableRecord>) {
    return records.map((record) => {
        return (willMoveRecordsMap.get(record._id) || record) as unknown as AITableViewRecord;
    });
}
