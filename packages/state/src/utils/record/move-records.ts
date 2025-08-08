import { getMaxPosition } from '../view';
import { Actions } from '../../action';
import { AITableRecordUpdatedInfo, AITableView, AITableViewRecord, AITableViewRecords, MoveRecordOptions, sortByViewPosition } from '@ai-table/utils';
import { AIViewTable } from '../../types';
import _ from 'lodash';

export function moveRecords(aiTable: AIViewTable, options: MoveRecordOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const gridRecords = aiTable.gridData().records as AITableViewRecords;
    const activeViewId = aiTable.activeViewId();
    const activeView = aiTable.views().find((view) => view._id === activeViewId) as AITableView;
    const { recordIds, newPath } = options;
    let targetPosition = 0;
    let prevPosition = 0;
    if (newPath[0] === 0) {
        targetPosition = gridRecords[0].positions[activeViewId]!;
        prevPosition = targetPosition - 1;
    } else if (newPath[0] >= gridRecords.length) {
        targetPosition = getMaxPosition(gridRecords, activeViewId) + 1;
        prevPosition = gridRecords[gridRecords.length - 1].positions[activeViewId]!;
    } else {
        targetPosition = gridRecords[newPath[0]].positions[activeViewId]!;
        prevPosition = gridRecords[newPath[0] - 1].positions[activeViewId]!;
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
        Actions.setRecordPositions(aiTable, { [activeViewId]: nextPosition }, [sourceIndex]);
        prevPosition = nextPosition;
        nextPosition = (prevPosition + targetPosition) / 2;
    });
}
