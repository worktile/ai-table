import { GRID_FIELD_HEAD_HEIGHT, GRID_ROW_HEAD_WIDTH, RowHeightLevel } from '../constants/grid';
import { Coordinate } from '../core/coordinate';
import { AITableGridView } from '../interface/view';
import { createGridStage } from './grid-stage';

export const createGridView = (config: AITableGridView) => {
    const { context, width: _containerWidth, height: containerHeight } = config;
    const { fields, records } = context;
    const offsetX = 32;
    const containerWidth = _containerWidth + offsetX;
    const rowCount = records.length;

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
        frozenColumnCount: 1,
        autoHeadHeight: false
    });

    return createGridStage({
        context,
        container: config.container,
        instance,
        scrollState: {
            scrollTop: 0,
            scrollLeft: 0,
            isScrolling: false
        },
        offsetX
    });
};
