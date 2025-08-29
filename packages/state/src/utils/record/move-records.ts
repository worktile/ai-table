import { getMaxPosition } from '../view';
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
import { AITableRowType } from '@ai-table/grid';
import { getGridDataRecordIndexByLinearRowIndex, getLinearRowTypeByLinerRowIndex } from '../group';

export function moveRecords(aiTable: AIViewTable, options: MoveRecordOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const gridRecords = aiTable.records() as AITableViewRecords;
    const activeViewId = aiTable.activeViewId();
    const activeView = aiTable.views().find((view) => view._id === activeViewId) as AITableView;
    const groups = activeView.settings?.groups;
    const { recordIds, newPath } = options;
    let targetIndex = newPath[0];
    let copyGroupIndexOffset = 0;
    if (groups?.length) {
        if (getLinearRowTypeByLinerRowIndex(aiTable, targetIndex) === AITableRowType.add) {
            copyGroupIndexOffset = 1;
        }
        targetIndex = getGridDataRecordIndexByLinearRowIndex(aiTable, targetIndex);
    }
    let targetPosition = 0;
    let prevPosition = 0;
    if (targetIndex === 0) {
        targetPosition = gridRecords[0].positions[activeViewId]!;
        prevPosition = targetPosition - 1;
    } else if (targetIndex >= gridRecords.length) {
        targetPosition = getMaxPosition(gridRecords, activeViewId) + 1;
        prevPosition = gridRecords[gridRecords.length - 1].positions[activeViewId]!;
    } else {
        targetPosition = gridRecords[targetIndex].positions[activeViewId]!;
        prevPosition = gridRecords[targetIndex - 1].positions[activeViewId]!;
    }

    const records = aiTable.records();
    const recordsIndexMap = new Map(records.map((row, index) => [row._id, index]));
    const sourceRecords: AITableViewRecord[] = [];
    recordIds.forEach((idPath) => {
        const index = recordsIndexMap.get(idPath[0]);
        if (index === undefined) {
            throw new Error(`Record with id ${idPath[0]} not found`);
        }
        sourceRecords.push(records[index] as AITableViewRecord);
    });
    // 勾选多行顺序可能不一致，需要排序
    const sortedSourceRecords = sortByViewPosition(sourceRecords, activeView) as AITableViewRecords;
    let nextPosition = (prevPosition + targetPosition) / 2;
    sortedSourceRecords.forEach((record) => {
        const sourceIndex = recordsIndexMap.get(record._id);
        if (sourceIndex === undefined) {
            throw new Error(`Record with id ${record._id} not found`);
        }
        if (groups?.length) {
            const updateFieldValues: UpdateFieldValueOptions[] = [];
            groups.forEach((group) => {
                updateFieldValues.push({
                    path: [record._id, group.field_id],
                    value: gridRecords[targetIndex - copyGroupIndexOffset].values[group.field_id]
                });
            });
            Actions.updateFieldValues(aiTable, updateFieldValues);
        }
        Actions.setRecordPositions(aiTable, { [activeViewId]: nextPosition }, [sourceIndex]);
        prevPosition = nextPosition;
        nextPosition = (prevPosition + targetPosition) / 2;
    });
}
