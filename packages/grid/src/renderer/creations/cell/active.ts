import Konva from 'konva';
import { DEFAULT_FONT_WEIGHT } from '../../../constants';
import { AITable, AITableQueries } from '../../../core';
import { AITableActiveCellOptions, AITableRenderStyle, AITableRowType } from '../../../types';
import { getCellHeight, getCellHorizontalPosition } from '../../../utils';
import { cellHelper } from '../../drawers/cell-drawer';
import { createCell } from './cell';

export const createActiveCell = (options: AITableActiveCellOptions) => {
    const { aiTable, context, instance, columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = options;
    const { linearRows, activeCellBound, pointPosition } = context;
    const { rowHeight, frozenColumnCount } = instance;
    const colors = AITable.getColors();
    const visibleColumns = AITable.getVisibleFields(aiTable);
    const activeCell = AITable.getActiveCell(aiTable);
    const activeCellHeight = activeCellBound().height;
    const totalColumnCount = visibleColumns.length;

    const checkIsVisible = (rowIndex: number, columnIndex: number) => {
        if (columnIndex < frozenColumnCount) {
            return true;
        }
        return rowIndex >= rowStartIndex && rowIndex <= rowStopIndex && columnIndex >= columnStartIndex && columnIndex <= columnStopIndex;
    };

    let activatedCell: Konva.Group | null = null;
    let activeCellBorder: Konva.Rect | null = null;
    let frozenActivatedCell: Konva.Group | null = null;
    let frozenActiveCellBorder: Konva.Rect | null = null;

    if (activeCell != null) {
        const { recordId, fieldId } = activeCell;
        const { rowIndex, columnIndex } = pointPosition();

        if (rowIndex != null && columnIndex != null && checkIsVisible(rowIndex, columnIndex)) {
            const { type } = linearRows[rowIndex];

            if (type === AITableRowType.record) {
                const activeField = visibleColumns.find((field) => field._id === fieldId);
                if (activeField == null) {
                    return {
                        activatedCell,
                        activeCellBorder,
                        frozenActivatedCell,
                        frozenActiveCellBorder
                    };
                }

                const x = instance.getColumnOffset(columnIndex);
                const y = instance.getRowOffset(rowIndex);
                const columnWidth = instance.getColumnWidth(columnIndex);
                const cellValue = AITableQueries.getFieldValue(aiTable, [recordId, fieldId]);
                const isFrozenColumn = columnIndex < frozenColumnCount;
                const { offset, width } = getCellHorizontalPosition({
                    columnWidth,
                    columnIndex,
                    columnCount: totalColumnCount
                });

                const renderOptions = {
                    x: x + offset,
                    y,
                    columnWidth: width,
                    rowHeight,
                    recordId,
                    field: activeField,
                    cellValue,
                    isActive: true,
                    style: {
                        fontWeight: DEFAULT_FONT_WEIGHT
                    } as AITableRenderStyle,
                    colors
                };

                cellHelper.needDraw = false;
                cellHelper.initStyle(activeField, { fontWeight: DEFAULT_FONT_WEIGHT });
                const renderData = cellHelper.renderCell(renderOptions);
                const height = getCellHeight({
                    field: activeField,
                    rowHeight,
                    activeHeight: activeCellHeight,
                    isActive: true
                });

                const currentCell = createCell({
                    aiTable,
                    context,
                    x: x + offset,
                    y,
                    columnWidth: width - 10,
                    rowHeight,
                    recordId,
                    renderData,
                    cellValue,
                    field: activeField,
                    isActive: true
                });

                const currentCellBorder = new Konva.Rect({
                    x: x + offset,
                    y,
                    width: width + 1,
                    height,
                    fillEnabled: false,
                    stroke: colors.primary,
                    strokeWidth: 2,
                    cornerRadius: 2,
                    listening: false
                });

                if (isFrozenColumn) {
                    frozenActivatedCell = currentCell;
                    frozenActiveCellBorder = currentCellBorder;
                } else {
                    activatedCell = currentCell;
                    activeCellBorder = currentCellBorder;
                }
            }
        }
    }

    return {
        activatedCell,
        activeCellBorder,
        frozenActivatedCell,
        frozenActiveCellBorder
    };
};
