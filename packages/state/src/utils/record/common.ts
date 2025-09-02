import { AITableViewRecord, AITableViewRecords } from '@ai-table/utils';
import { AIViewTable } from '../../types';
import { getMaxPosition } from '../view';

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

export function getPositionByAfterOrBeforeRecordId(
    aiTable: AIViewTable,
    options: { afterRecordId?: string; beforeRecordId?: string }
): { targetPosition: number; prevPosition: number } {
    const recordsMap = aiTable.recordsMap();
    const activeViewId = aiTable.activeViewId();
    const originalRecords = aiTable.records() as AITableViewRecords;
    const { afterRecordId, beforeRecordId } = options;
    let targetPosition = 0;
    let prevPosition = 0;

    if (afterRecordId) {
        // 移动到指定记录之后
        const targetRecord = recordsMap[afterRecordId] as AITableViewRecord;
        if (!targetRecord) {
            throw new Error(`Target record with id ${afterRecordId} not found`);
        }

        prevPosition = targetRecord.positions[activeViewId] || 0;
        const nextPosition = findNextRecordForTargetInOriginalRecords(aiTable, afterRecordId);
        if (nextPosition !== null) {
            targetPosition = nextPosition.positions[activeViewId] || 0;
        } else {
            // 最后一个
            targetPosition = getMaxPosition(originalRecords, activeViewId) + 1;
        }
    } else if (beforeRecordId) {
        // 移动到指定记录之前
        const targetRecord = recordsMap[beforeRecordId] as AITableViewRecord;
        if (!targetRecord) {
            throw new Error(`Target record with id ${beforeRecordId} not found`);
        }

        targetPosition = targetRecord.positions[activeViewId] || 0;
        const previousPosition = findPrevRecordForTargetInOriginalRecords(aiTable, beforeRecordId);
        if (previousPosition !== null) {
            prevPosition = previousPosition.positions[activeViewId] || 0;
        } else {
            // 第一个
            prevPosition = targetPosition - 1;
        }
    } else {
        throw new Error('Either afterRecordId or beforeRecordId must be provided');
    }
    return {
        targetPosition,
        prevPosition
    };
}
