import { AITableRecord, AITableViewRecord, AITableViewRecords, Positions } from '@ai-table/utils';
import { AIViewTable } from '../../types';
import { getMaxPosition } from '../view';
import _ from 'lodash';
import { getParentLinearRowGroups } from '../group/utils';
import { AITableRowType } from '@ai-table/grid';
import { insertAtEnd, insertAtStart, insertBetween } from '../position';

export function findNextRecordForTargetInOriginalRecords(aiTable: AIViewTable, targetRecordId: string): AITableViewRecord | null {
    const viewId = aiTable.activeViewId();
    const records = aiTable.records() as AITableViewRecords;
    const recordsMap = aiTable.recordsMap();

    const targetRecord = recordsMap[targetRecordId] as AITableViewRecord;
    const targetPosition = targetRecord.positions[viewId] || 0;

    let nextRecord: AITableViewRecord | null = null;
    for (const record of records) {
        const pos = record.positions[viewId] || 0;
        // 找到所有position大于目标position的记录中最小的
        if (pos > targetPosition && (nextRecord === null || pos < nextRecord.positions[viewId])) {
            nextRecord = record;
        }
    }

    return nextRecord;
}

export function findPrevRecordForTargetInOriginalRecords(aiTable: AIViewTable, targetRecordId: string): AITableViewRecord | null {
    const viewId = aiTable.activeViewId();
    const records = aiTable.records() as AITableViewRecords;
    const recordsMap = aiTable.recordsMap();

    const targetRecord = recordsMap[targetRecordId] as AITableViewRecord;
    const targetPosition = targetRecord.positions[viewId] || 0;

    let prevRecord: AITableViewRecord | null = null;
    for (const record of records) {
        const pos = record.positions[viewId] || 0;
        // 找到所有position小于目标记录position的记录中最大的
        if (pos < targetPosition && (prevRecord === null || pos > prevRecord.positions[viewId])) {
            prevRecord = record;
        }
    }

    return prevRecord;
}

export function getPreviousAndNextPosition(
    aiTable: AIViewTable,
    options: { afterRecordId?: string; beforeRecordId?: string }
): { nextPosition: number | null; previousPosition: number | null } {
    const recordsMap = aiTable.recordsMap();
    const activeViewId = aiTable.activeViewId();
    const { afterRecordId, beforeRecordId } = options;
    let nextPosition = null;
    let previousPosition = null;

    if (afterRecordId) {
        // 移动到指定记录之后
        const previousRecord = recordsMap[afterRecordId] as AITableViewRecord;
        if (!previousRecord) {
            throw new Error(`Target record with id ${afterRecordId} not found`);
        }

        previousPosition = previousRecord.positions[activeViewId] || 0;
        const nextRecord = findNextRecordForTargetInOriginalRecords(aiTable, afterRecordId);
        if (nextRecord !== null) {
            nextPosition = nextRecord.positions[activeViewId] || 0;
        }
    } else if (beforeRecordId) {
        // 移动到指定记录之前
        const nextRecord = recordsMap[beforeRecordId] as AITableViewRecord;
        if (!nextRecord) {
            throw new Error(`Target record with id ${beforeRecordId} not found`);
        }

        nextPosition = nextRecord.positions[activeViewId] || 0;
        const previousRecord = findPrevRecordForTargetInOriginalRecords(aiTable, beforeRecordId);
        if (previousRecord !== null) {
            previousPosition = previousRecord.positions[activeViewId] || 0;
        }
    } else {
        throw new Error('Either afterRecordId or beforeRecordId must be provided');
    }
    return {
        nextPosition,
        previousPosition
    };
}

export function getCurrentViewPositions(
    aiTable: AIViewTable,
    options: { afterRecordId?: string; beforeRecordId?: string; count?: number }
) {
    const { previousPosition, nextPosition } = getPreviousAndNextPosition(aiTable, options);
    const count = options.count || 1;
    let positions = [];
    if (options.beforeRecordId && previousPosition === null && nextPosition !== null) {
        positions = insertAtStart(nextPosition, count).map((item) => item.position);
    } else if (options.afterRecordId && nextPosition === null && previousPosition !== null) {
        positions = insertAtEnd(previousPosition, count).map((item) => item.position);
    } else {
        positions = insertBetween(previousPosition!, nextPosition!, count).positions;
    }
    return positions;
}

export function getNewRecordsPosition(aiTable: AIViewTable, options?: { afterRecordId?: string; beforeRecordId?: string; count?: number }) {
    options = options || {};
    if (!options.afterRecordId && !options.beforeRecordId) {
        options.afterRecordId = aiTable.gridData().records[aiTable.gridData().records.length - 1]._id;
    }
    let positions = getCurrentViewPositions(aiTable, options);
    const views = aiTable.views();
    const activeViewId = aiTable.activeViewId();
    const viewsMaxPosition: Record<string, number> = {};
    views.forEach((view) => {
        viewsMaxPosition[view._id] = getMaxPosition(aiTable.records() as AITableViewRecord[], view._id);
    });

    const viewPositions = positions.map((itemPosition) => {
        const viewPositions: Positions = {};
        views.forEach((view) => {
            if (view._id === activeViewId) {
                viewPositions[view._id] = itemPosition;
            } else {
                const maxPosition = viewsMaxPosition[view._id];
                const newMaxPosition = insertAtEnd(maxPosition, 1);
                viewsMaxPosition[view._id] += newMaxPosition[0].position;
                viewPositions[view._id] = viewsMaxPosition[view._id];
            }
        });
        return viewPositions;
    });
    return viewPositions;
}

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
