import Konva from 'konva';
import { AI_TABLE_CELL, AI_TABLE_OFFSET } from '../../constants';
import { AITable } from '../../core';
import { AITableCellsOptions, AITableRowType } from '../../types';
import { generateTargetName, getCellHorizontalPosition } from '../../utils';

/**
 * 生成占位符单元格的函数
 * @param options
 * @returns
 */
export const createPlaceHolderCells = (options: AITableCellsOptions) => {
    const { aiTable, coordinate, columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = options;
    const { linearRows } = aiTable.context!;
    const { rowHeight, columnCount, rowCount } = coordinate;
    const colors = AITable.getColors();
    const visibleColumns = AITable.getVisibleFields(aiTable);
    const placeHolderCells: Konva.Rect[] = [];

    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        // 当前列索引超出总列数范围，返回空
        if (columnIndex > columnCount - 1) {
            return [];
        }
        const field = visibleColumns[columnIndex];
        const fieldId = field._id;

        // 当前列不存在，返回空
        if (field == null) {
            return [];
        }

        // 当前列的 X 轴偏移量和列宽度
        const x = coordinate.getColumnOffset(columnIndex) + AI_TABLE_OFFSET;
        const columnWidth = coordinate.getColumnWidth(columnIndex);

        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
            // 当前行索引是否超出总行数范围，超出则退出循环
            if (rowIndex > rowCount - 1) {
                break;
            }

            const row = linearRows()[rowIndex];
            const { _id: recordId, type } = row;
            if (type !== AITableRowType.record) {
                continue;
            }

            // 当前行的 Y 轴偏移量，并根据列宽和列索引获取单元格的水平位置（宽度和偏移量）
            const y = coordinate.getRowOffset(rowIndex) + AI_TABLE_OFFSET;
            const { width, offset } = getCellHorizontalPosition({
                columnWidth,
                columnIndex,
                columnCount
            });

            const height = rowHeight;
            const rect = new Konva.Rect({
                key: `placeholder-cell-${fieldId}-${recordId}`,
                name: generateTargetName({
                    targetName: AI_TABLE_CELL,
                    fieldId,
                    recordId
                }),
                x: x + offset,
                y,
                width,
                height,
                fill: colors.transparent,
                strokeEnabled: false,
                hitStrokeWidth: 0,
                transformsEnabled: 'position',
                perfectDrawEnabled: false,
                shadowEnabled: false
            });

            placeHolderCells.unshift(rect);
        }
    }
    return placeHolderCells;
};
