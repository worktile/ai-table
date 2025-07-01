import { AI_TABLE_FIELD_STAT_HEIGHT, Colors } from '../../constants';
import { AITableFieldStatsConfig, AITableFieldStatConfig } from '../../types';

export const createFieldStats = (config: AITableFieldStatsConfig) => {
    const { coordinate, columnStartIndex, columnStopIndex, aiTable, actions, y } = config;
    const colors = Colors;
    const { columnCount, rowInitSize: fieldHeadHeight } = coordinate;
    const fields = aiTable.gridData().fields;

    const fieldStats: AITableFieldStatConfig[] = [];
    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        if (columnIndex > columnCount - 1) break;
        if (columnIndex < 0) continue;
        const field = fields[columnIndex];
        if (field == null) continue;
        const x = coordinate.getColumnOffset(columnIndex);
        const columnWidth = coordinate.getColumnWidth(columnIndex);
        const fieldStat = {
            aiTable,
            coordinate,
            actions,
            x,
            y,
            width: columnWidth,
            height: AI_TABLE_FIELD_STAT_HEIGHT,
            field,
            stroke: columnIndex === 0 ? colors.transparent : undefined
        };

        fieldStats.push(fieldStat);
    }
    return fieldStats;
};
