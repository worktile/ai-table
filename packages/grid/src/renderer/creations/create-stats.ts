import { AI_TABLE_FIELD_HEAD_HEIGHT, AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT, AI_TABLE_OFFSET, Colors } from '../../constants';
import { AITableFieldStatsConfig, AITableFieldStatConfig, AITableGroupStatConfig } from '../../types';

export const createFieldStats = (config: AITableFieldStatsConfig) => {
    const { coordinate, columnStartIndex, columnStopIndex, aiTable, actions, y, isHoverStatContainer, readonly } = config;
    const colors = Colors;
    const { columnCount, rowInitSize: fieldHeadHeight } = coordinate;
    const fields = aiTable.gridData().fields;

    const fieldStats: AITableFieldStatConfig[] = [];
    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        if (columnIndex > columnCount - 1) break;
        if (columnIndex < 0) continue;
        const field = fields[columnIndex];
        if (field == null) continue;
        const x = coordinate.getColumnOffset(columnIndex) + AI_TABLE_OFFSET;
        const columnWidth = coordinate.getColumnWidth(columnIndex);
        const fieldStat = {
            aiTable,
            coordinate,
            actions,
            columnIndex,
            x,
            y,
            width: columnWidth,
            height: AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT,
            field,
            stroke: columnIndex === 0 ? colors.transparent : undefined,
            isHoverStatContainer: isHoverStatContainer,
            readonly
        };

        fieldStats.push(fieldStat);
    }
    return fieldStats;
};

export const createGroupFieldStats = (config: AITableFieldStatsConfig) => {
    const { coordinate, columnStartIndex, columnStopIndex, aiTable, actions, y, height, isHoverStatContainer, readonly, groupRow } = config;
    const colors = Colors;
    const { columnCount, rowInitSize: fieldHeadHeight } = coordinate;
    const fields = aiTable.gridData().fields;

    const fieldStats: AITableGroupStatConfig[] = [];
    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        if (columnIndex > columnCount - 1) break;
        if (columnIndex < 0) continue;
        const field = fields[columnIndex];
        if (field == null) continue;
        const x = coordinate.getColumnOffset(columnIndex) + AI_TABLE_OFFSET;
        const columnWidth = coordinate.getColumnWidth(columnIndex);
        const fieldStat = {
            aiTable,
            coordinate,
            actions,
            columnIndex,
            x,
            y: y,
            width: columnWidth,
            height: height ?? AI_TABLE_FIELD_HEAD_HEIGHT,
            field,
            isHoverStatContainer: isHoverStatContainer,
            readonly,
            isGroupStat: true,
            groupRow: groupRow!
        };

        fieldStats.push(fieldStat);
    }
    return fieldStats;
};
