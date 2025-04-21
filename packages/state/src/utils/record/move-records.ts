import { AITableRecordUpdatedInfo, MoveRecordOptions } from '@ai-table/grid';
import { AITableView, AITableViewRecords, AIViewTable } from '../../types';
import { getMaxPosition } from '../view';
import { sortByViewPosition } from '../common';
import { Actions } from '../../action';

export function moveRecords(aiTable: AIViewTable, options: MoveRecordOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const records = aiTable.gridData().records as AITableViewRecords;
    const activeViewId = aiTable.activeViewId();
    const activeView = aiTable.views().find((view) => view._id === activeViewId) as AITableView;
    const { paths, newPath } = options;
    let targetPosition = 0;
    let prevPosition = 0;
    if (newPath[0] === 0) {
        targetPosition = records[0].positions[activeViewId]!;
        prevPosition = targetPosition - 1;
    } else if (newPath[0] >= records.length) {
        targetPosition = getMaxPosition(records, activeViewId) + 1;
        prevPosition = records[records.length - 1].positions[activeViewId]!;
    } else {
        targetPosition = records[newPath[0]].positions[activeViewId]!;
        prevPosition = records[newPath[0] - 1].positions[activeViewId]!;
    }
    const sourceRecords = paths.map((path) => records[path[0]]);
    const sortedSourceRecords = sortByViewPosition(sourceRecords, activeView);
    let nextPosition = (prevPosition + targetPosition) / 2;
    sortedSourceRecords.forEach((record) => {
        Actions.setRecordPositions(aiTable, { [activeViewId]: nextPosition }, [record._id]);
        prevPosition = nextPosition;
        nextPosition = (prevPosition + targetPosition) / 2;
    });
}
