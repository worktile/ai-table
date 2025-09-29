import { Actions } from '../../action';
import {
    AITableView,
    AITableViewRecord,
    AITableViewRecords,
    MoveRecordOptions,
    sortByViewPosition,
    UpdateFieldValueOptions
} from '@ai-table/utils';
import { AIViewTable } from '../../types';
import _ from 'lodash';
import { getParentGroupValuesByGroupId } from './common';
import { PositionsActions } from '../../action/position';
import { getCurrentViewPositions, ViewPositionOptions } from '../position-in-view';

export function moveRecords(aiTable: AIViewTable, options: MoveRecordOptions) {
    const viewPositionOptions: ViewPositionOptions = {
        afterItemId: options.afterRecordId,
        beforeItemId: options.beforeRecordId,
        count: options.recordIds.length
    };
    let positions = getCurrentViewPositions(aiTable, viewPositionOptions, aiTable.records() as AITableViewRecord[], aiTable.recordsMap());
    if (positions.length === 0) {
        PositionsActions.resetAllRecordsPositions(aiTable);
        positions = getCurrentViewPositions(aiTable, viewPositionOptions, aiTable.records() as AITableViewRecord[], aiTable.recordsMap());
        console.log('Reset all records positions');
    }
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
    const groups = activeView.settings?.groups;
    let needCopyGroupValuesMap: Record<string, any> | null = null;
    if (groups?.length && (afterRecordId || beforeRecordId)) {
        needCopyGroupValuesMap = getParentGroupValuesByGroupId(aiTable, (afterRecordId || beforeRecordId)!);
    }
    const sortedSourceRecords = sortByViewPosition(sourceRecords, activeView) as AITableViewRecords;
    sortedSourceRecords.forEach((record, index) => {
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
        Actions.setRecordPositions(aiTable, { [activeViewId]: positions[index] }, [sourceIndex]);
    });
}
