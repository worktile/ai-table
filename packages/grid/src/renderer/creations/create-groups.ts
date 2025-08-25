import {
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE,
    AI_TABLE_FIELD_STAT_INNER_HEIGHT,
    AI_TABLE_OFFSET,
    Colors
} from '../../constants';
import {
    AITableFieldStatsConfig,
    AITableFieldStatConfig,
    AITableGroupOptionsConfig,
    AITableGroupConfig,
    AITableRowType,
    AITableCellsConfig
} from '../../types';
import { getCellHorizontalPosition } from '../../utils';

export const createGroupCells = (config: AITableCellsConfig) => {
    const { coordinate, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, aiTable, actions, readonly } = config;
    const linearRows = aiTable.context?.linearRows()!;
    const { columnCount } = coordinate;
    const groups: AITableGroupConfig[] = [];
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        if (rowIndex > columnCount - 1) break;
        if (rowIndex < 0) continue;
        const row = linearRows[rowIndex];
        const { depth } = row;

        if (row == null) continue;
        if (row.type !== AITableRowType.group) continue;
        const y = coordinate.getRowOffset(rowIndex) + AI_TABLE_OFFSET;
        const rowHeight = coordinate.getRowHeight(rowIndex);

        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            const columnWidth = coordinate.getColumnWidth(columnIndex);
            const { width, offset } = getCellHorizontalPosition({
                columnIndex,
                columnWidth,
                columnCount,
                depth
            });
            const x = coordinate.getColumnOffset(columnIndex);
            const group: AITableGroupConfig = {
                aiTable,
                coordinate,
                columnIndex,
                x: x + offset + AI_TABLE_CELL_PADDING,
                y,
                width,
                height: rowHeight,
                row,
                readonly
            };

            groups.push(group);
        }
    }
    return groups;
};
