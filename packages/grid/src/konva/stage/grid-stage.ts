import Konva from 'konva';
import { createGrid } from '../grid/create-grid';
import { AITableKonvaGridStage } from '../interface/view';

Konva.pixelRatio = 2;

export const createGridStage = (config: AITableKonvaGridStage) => {
    const { instance, scrollState, offsetX = 0 } = config;
    const { scrollTop, scrollLeft } = scrollState;
    const { rowCount, columnCount, frozenColumnCount, containerWidth, containerHeight } = instance;

    // 获取要渲染的垂直可见区域
    const getVerticalRangeInfo = () => {
        const startIndex = instance.getRowStartIndex(scrollTop);
        const stopIndex = instance.getRowStopIndex(startIndex, scrollTop);

        return {
            rowStartIndex: Math.max(0, startIndex),
            rowStopIndex: Math.max(0, Math.min(rowCount - 1, stopIndex))
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

    const stage = new Konva.Stage({
        container: config.container,
        width: containerWidth,
        height: containerHeight,
        listening: false
    });

    const grid = createGrid({
        aiTable: config.aiTable,
        fields: config.fields,
        records: config.records,
        instance,
        scrollState,
        rowStartIndex,
        rowStopIndex,
        columnStartIndex,
        columnStopIndex,
        offsetX
    });
    stage.add(grid);

    return stage;
};
