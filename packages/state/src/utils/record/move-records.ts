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
import { AITableLinearRowRecord, AITableQueries, AITableRowType } from '@ai-table/grid';

// function getPosition(aiTable: AIViewTable, options: MoveRecordOptions, activeViewId: string) {
//     let { newPath, groupHeadRecordId } = options;
//     const gridRecords = aiTable.gridData().records as AITableViewRecords;
//     let targetPosition = 0;
//     let prevPosition = 0;
//     if (!groupHeadRecordId) {
//         if (newPath[0] === 0) {
//             targetPosition = gridRecords[0].positions[activeViewId]!;
//             prevPosition = targetPosition - 1;
//         } else if (newPath[0] >= gridRecords.length) {
//             targetPosition = getMaxPosition(gridRecords, activeViewId) + 1;
//             prevPosition = gridRecords[gridRecords.length - 1].positions[activeViewId]!;
//         } else {
//             targetPosition = gridRecords[newPath[0]].positions[activeViewId]!;
//             prevPosition = gridRecords[newPath[0] - 1].positions[activeViewId]!;
//         }
//     } else {
//         const linearRows = aiTable.context!.linearRows();
//         const rowIndexMap = aiTable.context!.visibleRowsIndexMap();
//         const lineRow = linearRows[newPath[0]];
//         const lineRecord = (lineRow.type === AITableRowType.add ? linearRows[newPath[0] - 1] : lineRow) as AITableLinearRowRecord;
//         // 每个分组之间的标记 add + blank
//         const GROUP_MARKERS = 2;
//         if (lineRecord.displayIndex === 1) {
//             targetPosition = gridRecords[rowIndexMap.get(lineRecord._id)!].positions[activeViewId]!;
//             prevPosition = targetPosition - 1;
//         } else if (newPath[0] >= linearRows.length - GROUP_MARKERS) {
//             // 先判断 -2 排除最后的添加按钮和空行标记，是否拖拽到最后
//             const lastRecord = gridRecords[gridRecords.length - GROUP_MARKERS];
//             prevPosition = lastRecord.positions[activeViewId]!;
//             targetPosition = prevPosition + 1;
//         } else if (lineRow.type === AITableRowType.add) {
//             // 否则分组内最后一个
//             const lastRecord = gridRecords[rowIndexMap.get(lineRecord._id)!];
//             prevPosition = lastRecord.positions[activeViewId]!;
//             // 下一个分组第一个位置
//             const nextGroupFirstRecord = gridRecords[rowIndexMap.get(lineRecord._id)! + GROUP_MARKERS];
//             targetPosition = nextGroupFirstRecord.positions[activeViewId]!;
//         }
//     }
//     return { targetPosition, prevPosition };
// }

export function moveRecords(aiTable: AIViewTable, options: MoveRecordOptions, updatedInfo: AITableRecordUpdatedInfo) {
    const gridRecords = aiTable.gridData().records as AITableViewRecords;
    const activeViewId = aiTable.activeViewId();
    const activeView = aiTable.views().find((view) => view._id === activeViewId) as AITableView;
    const { recordIds, newPath, isGroup } = options;
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
    const groups = activeView.settings?.groups;
    sortedSourceRecords.forEach((record) => {
        const sourceIndex = recordsIndexMap.get(record._id);
        if (sourceIndex === undefined) {
            throw new Error(`Record with id ${record._id} not found`);
        }
        if (isGroup && groups?.length) {
            const updateFieldValues: UpdateFieldValueOptions[] = [];
            groups.forEach((group) => {
                updateFieldValues.push({
                    path: [record._id, group.field_id],
                    value: gridRecords[newPath[0] - 1].values[group.field_id]
                });
            });
            Actions.updateFieldValues(aiTable, updateFieldValues);
        }
        Actions.setRecordPositions(aiTable, { [activeViewId]: nextPosition }, [sourceIndex]);
        prevPosition = nextPosition;
        nextPosition = (prevPosition + targetPosition) / 2;
    });
}
