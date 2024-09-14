import Konva from 'konva';
import { AI_TABLE_CELL_BORDER } from '../../constants';
import { AITable } from '../../core';
import { AITableCellsOptions, AITableRowType } from '../../types';
import { getCellHorizontalPosition } from '../../utils';

export const createActiveCellBorder = (options: AITableCellsOptions) => {
    const { aiTable, coordinate, columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = options;
    const { linearRows } = aiTable.context!;
    const { rowHeight, frozenColumnCount } = coordinate;
    const colors = AITable.getColors();
    const visibleColumns = AITable.getVisibleFields(aiTable);
    const activeCell = AITable.getActiveCell(aiTable);
    const totalColumnCount = visibleColumns.length;

    let activeCellBorder: Konva.Rect | null = null;
    let frozenActiveCellBorder: Konva.Rect | null = null;

    if (activeCell != null) {
        const { fieldId } = activeCell;
        const { rowIndex, columnIndex } = AITable.getCellIndex(aiTable, activeCell)!;

        const checkIsVisible = (rowIndex: number, columnIndex: number) => {
            if (columnIndex < frozenColumnCount) {
                return true;
            }
            return (
                rowIndex >= rowStartIndex && rowIndex <= rowStopIndex && columnIndex >= columnStartIndex && columnIndex <= columnStopIndex
            );
        };

        if (rowIndex != null && columnIndex != null && checkIsVisible(rowIndex, columnIndex)) {
            const { type } = linearRows()[rowIndex];

            if (type === AITableRowType.record) {
                const activeField = visibleColumns.find((field) => field._id === fieldId);
                if (activeField == null) {
                    return {
                        activeCellBorder,
                        frozenActiveCellBorder
                    };
                }

                const x = coordinate.getColumnOffset(columnIndex);
                const y = coordinate.getRowOffset(rowIndex);
                const columnWidth = coordinate.getColumnWidth(columnIndex);
                const isFrozenColumn = columnIndex < frozenColumnCount;
                const { offset, width } = getCellHorizontalPosition({
                    columnWidth,
                    columnIndex,
                    columnCount: totalColumnCount
                });
                const borderOffset = 1;

                const currentCellBorder = new Konva.Rect({
                    x: x + offset + borderOffset,
                    y,
                    width: width,
                    height: rowHeight,
                    strokeWidth: AI_TABLE_CELL_BORDER,
                    stroke: colors.primary,
                    fillEnabled: false,
                    listening: false
                });

                if (isFrozenColumn) {
                    frozenActiveCellBorder = currentCellBorder;
                } else {
                    activeCellBorder = currentCellBorder;
                }
            }
        }
    }

    return {
        activeCellBorder,
        frozenActiveCellBorder
    };
};
