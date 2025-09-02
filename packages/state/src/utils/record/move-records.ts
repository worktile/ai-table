import { Actions } from '../../action';
import {
    AITableRecordUpdatedInfo,
    AITableView,
    AITableViewRecord,
    AITableViewRecords,
    MoveRecordOptions,
    sortByViewPosition
} from '@ai-table/utils';
import { AIViewTable } from '../../types';
import { getMaxPosition } from '../view';
import _ from 'lodash';

export function findNextPositionByOriginalRecords(aiTable: AIViewTable, targetRecordId: string): number | null {
    const viewId = aiTable.activeViewId();
    const records = aiTable.records() as AITableViewRecords;
    const recordsMap = aiTable.recordsMap();

    const targetRecord = recordsMap[targetRecordId] as AITableViewRecord;
    const targetPosition = targetRecord.positions[viewId] || 0;

    let nextPosition: number | null = null;
    for (const record of records) {
        const pos = record.positions[viewId] || 0;
        // 找到所有position大于目标position的记录中最小的
        if (pos > targetPosition && (nextPosition === null || pos < nextPosition)) {
            nextPosition = pos;
        }
    }

    return nextPosition;
}

export function findPrevPositionByOriginalRecords(aiTable: AIViewTable, targetRecordId: string): number | null {
    const viewId = aiTable.activeViewId();
    const records = aiTable.records() as AITableViewRecords;
    const recordsMap = aiTable.recordsMap();

    const targetRecord = recordsMap[targetRecordId] as AITableViewRecord;
    const targetPosition = targetRecord.positions[viewId] || 0;

    let prevPosition: number | null = null;
    for (const record of records) {
        const pos = record.positions[viewId] || 0;
        // 找到所有position小于目标记录position的记录中最大的
        if (pos < targetPosition && (prevPosition === null || pos > prevPosition)) {
            prevPosition = pos;
        }
    }

    return prevPosition;
}

export function moveRecords(aiTable: AIViewTable, options: MoveRecordOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const activeViewId = aiTable.activeViewId();
    const activeView = aiTable.views().find((view) => view._id === activeViewId) as AITableView;
    const { recordIds, afterRecordId, beforeRecordId } = options;

    const originalRecords = aiTable.records() as AITableViewRecords;
    const recordsIndexMap = new Map(originalRecords.map((row, index) => [row._id, index]));
    const recordsMap = aiTable.recordsMap();

    const sourceRecords: AITableViewRecord[] = [];
    recordIds.forEach((idPath) => {
        const index = recordsIndexMap.get(idPath[0]);
        if (index === undefined) {
            throw new Error(`Record with id ${idPath[0]} not found`);
        }
        sourceRecords.push(originalRecords[index] as AITableViewRecord);
    });

    let targetPosition = 0;
    let prevPosition = 0;

    if (afterRecordId) {
        // 移动到指定记录之后
        const targetRecord = recordsMap[afterRecordId] as AITableViewRecord;
        if (!targetRecord) {
            throw new Error(`Target record with id ${afterRecordId} not found`);
        }

        prevPosition = targetRecord.positions[activeViewId] || 0;
        const nextPosition = findNextPositionByOriginalRecords(aiTable, afterRecordId);
        if (nextPosition !== null) {
            targetPosition = nextPosition;
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
        const previousPosition = findPrevPositionByOriginalRecords(aiTable, beforeRecordId);
        if (previousPosition !== null) {
            prevPosition = previousPosition;
        } else {
            // 第一个
            prevPosition = targetPosition - 1;
        }
    } else {
        throw new Error('Either afterRecordId or beforeRecordId must be provided');
    }

    // 勾选多行顺序可能不一致，需要排序
    const sortedSourceRecords = sortByViewPosition(sourceRecords, activeView) as AITableViewRecords;
    let nextPosition = (prevPosition + targetPosition) / 2;
    sortedSourceRecords.forEach((record) => {
        const sourceIndex = recordsIndexMap.get(record._id);
        if (sourceIndex === undefined) {
            throw new Error(`Record with id ${record._id} not found`);
        }
        Actions.setRecordPositions(aiTable, { [activeViewId]: nextPosition }, [sourceIndex]);
        prevPosition = nextPosition;
        nextPosition = (prevPosition + targetPosition) / 2;
    });
}
