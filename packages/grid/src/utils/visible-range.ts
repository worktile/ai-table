import { Coordinate } from '../core';
import { AITableScrollState } from '../types';

export const getVisibleRangeInfo = (instance: Coordinate, scrollState: AITableScrollState) => {
    const { scrollTop, scrollLeft } = scrollState;
    const { rowCount, columnCount, frozenColumnCount } = instance;

    // 获取要渲染的垂直可见区域
    const getVerticalRangeInfo = () => {
        const startIndex = instance.getRowStartIndex(scrollTop);
        const stopIndex = instance.getRowStopIndex(startIndex, scrollTop);

        return {
            rowStartIndex: Math.max(0, startIndex - 1),
            rowStopIndex: Math.max(0, Math.min(rowCount - 1, stopIndex + 1))
        };
    };

    // 获取要渲染的水平可见区域
    const getHorizontalRangeInfo = () => {
        const startIndex = instance.getColumnStartIndex(scrollLeft);
        const stopIndex = instance.getColumnStopIndex(startIndex, scrollLeft);

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
