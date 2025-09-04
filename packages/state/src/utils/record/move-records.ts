import { Actions } from '../../action';
import {
    AITableRecordUpdatedInfo,
    AITableView,
    AITableViewRecord,
    AITableViewRecords,
    MoveRecordOptions,
    sortByViewPosition,
    UpdateFieldValueOptions
} from '@ai-table/utils';
import { AIViewTable } from '../../types';
import _ from 'lodash';
import { getParentGroupValuesByGroupId, getPositionByAfterOrBeforeRecordId } from './common';

export function moveRecords(aiTable: AIViewTable, options: MoveRecordOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const activeViewId = aiTable.activeViewId();
    const activeView = aiTable.views().find((view) => view._id === activeViewId) as AITableView;
    const { recordIds, afterRecordId, beforeRecordId } = options;

    const originalRecords = aiTable.records() as AITableViewRecords;
    const recordsIndexMap = new Map(originalRecords.map((row, index) => [row._id, index]));

    const sourceRecords: AITableViewRecord[] = [];
    recordIds.forEach((id) => {
        const index = recordsIndexMap.get(id);
        if (index === undefined) {
            throw new Error(`Record with id ${id} not found`);
        }
        sourceRecords.push(originalRecords[index] as AITableViewRecord);
    });

    let { targetPosition, prevPosition } = getPositionByAfterOrBeforeRecordId(aiTable, {
        afterRecordId,
        beforeRecordId
    });
    const groups = activeView.settings?.groups;
    let needCopyGroupValuesMap: Record<string, any> | null = null;
    if (groups?.length && (afterRecordId || beforeRecordId)) {
        needCopyGroupValuesMap = getParentGroupValuesByGroupId(aiTable, (afterRecordId || beforeRecordId)!);
    }
    // 勾选多行顺序可能不一致，需要排序
    const sortedSourceRecords = sortByViewPosition(sourceRecords, activeView) as AITableViewRecords;
    let nextPosition = (prevPosition + targetPosition) / 2;
    sortedSourceRecords.forEach((record) => {
        const sourceIndex = recordsIndexMap.get(record._id);
        if (sourceIndex === undefined) {
            throw new Error(`Record with id ${record._id} not found`);
        }
        if (groups?.length && needCopyGroupValuesMap) {
            const updateFieldValues: UpdateFieldValueOptions[] = [];
            groups.forEach((group) => {
                updateFieldValues.push({
                    path: [record._id, group.field_id],
                    value: needCopyGroupValuesMap[group.field_id]
                });
            });
            Actions.updateFieldValues(aiTable, updateFieldValues);
        }
        Actions.setRecordPositions(aiTable, { [activeViewId]: nextPosition }, [sourceIndex]);
        prevPosition = nextPosition;
        nextPosition = (prevPosition + targetPosition) / 2;
    });
}
