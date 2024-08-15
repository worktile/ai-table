import { GRID_FIELD_HEAD_HEIGHT, GRID_ROW_HEAD_WIDTH, RowHeightLevel } from '../constants/grid';
import { Coordinate } from '../core/coordinate';
import { AITableGridView } from '../interface/view';
import { createGridStage } from '../stage/grid-stage';
import { getLinearRowsAndGroup } from '../utils/view-group-derviate';

export const createGridView = (config: AITableGridView) => {
    const { aiTable, fields, records, width: _containerWidth, height: containerHeight } = config;
    const offsetX = 32;
    const containerWidth = _containerWidth + offsetX;

    const { linearRows } = getLinearRowsAndGroup([], records);
    const rowCount = linearRows.length;

    /**
     * 当前表格的数据示例。
     * 提供与时间轴和坐标相关的方法。
     */
    const instance = new Coordinate({
        rowHeight: 44,
        columnWidth: 200,
        rowHeightLevel: RowHeightLevel.medium,
        rowCount,
        columnCount: fields.length,
        containerWidth,
        containerHeight,
        rowInitSize: GRID_FIELD_HEAD_HEIGHT,
        columnInitSize: GRID_ROW_HEAD_WIDTH,
        frozenColumnCount: 1
    });

    return createGridStage({
        aiTable: config.aiTable,
        fields: config.fields,
        records: config.records,
        container: config.container,
        instance,
        linearRows,
        scrollState: {
            scrollTop: 0,
            scrollLeft: 0,
            isScrolling: false
        },
        offsetX
    });
};
