import { isNumber } from 'lodash';
import { AI_TABLE_FIELD_ADD_BUTTON_WIDTH, AI_TABLE_ROW_HEAD_WIDTH } from '../constants';
import { AITable, AITableField, AITableFieldOption, Coordinate, getFieldOptionByField } from '../core';
import { AITableScrollState } from '../types';

export const getVisibleRangeInfo = (coordinate: Coordinate, scrollState: AITableScrollState) => {
    const { scrollTop, scrollLeft } = scrollState;
    const { rowCount, columnCount, frozenColumnCount } = coordinate;

    // 获取要渲染的垂直可见区域
    const getVerticalRangeInfo = () => {
        const startIndex = coordinate.getRowStartIndex(scrollTop);
        const stopIndex = coordinate.getRowStopIndex(startIndex, scrollTop);

        return {
            rowStartIndex: Math.max(0, startIndex - 1),
            rowStopIndex: Math.max(0, Math.min(rowCount - 1, stopIndex + 1))
        };
    };

    // 获取要渲染的水平可见区域
    const getHorizontalRangeInfo = () => {
        const startIndex = coordinate.getColumnStartIndex(scrollLeft);
        const stopIndex = coordinate.getColumnStopIndex(startIndex, scrollLeft);

        return {
            columnStartIndex: Math.max(frozenColumnCount - 1, startIndex),
            columnStopIndex: Math.max(frozenColumnCount - 1, Math.min(columnCount - 1, stopIndex))
        };
    };

    const { rowStartIndex, rowStopIndex } = getVerticalRangeInfo();
    const { columnStartIndex, columnStopIndex } = getHorizontalRangeInfo();
    return {
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex
    };
};

export const scrollMax = (aiTable: AITable, coordinate: Coordinate, visibleColumns: AITableField[]) => {
    const visibleColumnIndexMap = aiTable.context!.visibleColumnsIndexMap();

    const scrollMaxWidth =
        visibleColumns.reduce((pre, cur) => {
            const index = visibleColumnIndexMap.get(cur._id);
            return pre + (isNumber(index) ? coordinate.getColumnWidth(index) : 0);
        }, AI_TABLE_ROW_HEAD_WIDTH) + AI_TABLE_FIELD_ADD_BUTTON_WIDTH;
    const scrollMaxHeight = coordinate.getRowOffset(coordinate.rowCount - 1) + 32;
    return { scrollMaxWidth, scrollMaxHeight };
};
