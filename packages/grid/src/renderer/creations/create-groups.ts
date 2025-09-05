import { AI_TABLE_CELL_PADDING, AI_TABLE_OFFSET } from '../../constants';
import { AITableGroupConfig, AITableRowType, AITableCellsConfig } from '../../types';
import { getCellHorizontalPosition } from '../../utils';

export const createGroupCells = (config: AITableCellsConfig) => {
    const { coordinate, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, aiTable, actions, readonly } = config;
    const linearRows = aiTable.context?.linearRows()!;
    const { rowCount, columnCount } = coordinate;
    const groups: AITableGroupConfig[] = [];
    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        if (rowIndex > rowCount - 1) break;
        if (rowIndex < 0) continue;
        const row = linearRows[rowIndex];
        const { depth } = row;
        if (row == null) continue;
        if (row.type !== AITableRowType.group) continue;
        const y = coordinate.getRowOffset(rowIndex) + AI_TABLE_OFFSET;
        const rowHeight = coordinate.getRowHeight(rowIndex);
        const columnWidth = coordinate.getColumnWidth(columnStartIndex);
        const { offset } = getCellHorizontalPosition({
            columnIndex: columnStartIndex,
            columnWidth,
            columnCount,
            depth
        });
        const x = coordinate.getColumnOffset(columnStartIndex);
        const group: AITableGroupConfig = {
            aiTable,
            coordinate,
            rowIndex,
            x: x + offset + AI_TABLE_CELL_PADDING,
            y,
            height: rowHeight,
            row: {
                ...row,
                rowIndex
            },
            readonly
        };

        groups.push(group);
    }
    return groups;
};
