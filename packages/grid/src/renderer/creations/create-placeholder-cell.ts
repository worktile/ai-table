import Konva from 'konva';
import _ from 'lodash';
import { AI_TABLE_CELL, AI_TABLE_OFFSET, DBL_CLICK_EDIT_TYPE } from '../../constants';
import { AITable } from '../../core';
import { AITablePlaceholderDrawerOptions, AITableRowType } from '../../types';
import { generateTargetName, getCellHeight, getCellHorizontalPosition } from '../../utils';

/**
 * 生成占位符单元格的函数
 * @param options
 * @returns
 */
export const getPlaceHolderCellsByColumnIndex = (options: AITablePlaceholderDrawerOptions) => {
    const { aiTable, coordinate, columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = options;
    const { linearRows, toggleEditing } = aiTable.context!;
    const { rowHeight, columnCount, rowCount } = coordinate;
    const colors = AITable.getColors();
    const visibleColumns = AITable.getVisibleFields(aiTable);
    const activeCell = AITable.getActiveCell(aiTable);
    const activeCellHeight = rowHeight;
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
            const isActive = _.isEqual(activeCell, { fieldId, recordId });
            let height = rowHeight;

            // 判断当前单元格是否为活动单元格。如果是，则更新其高度为活动单元格高度
            if (isActive) {
                height = getCellHeight({
                    field,
                    rowHeight,
                    activeHeight: activeCellHeight,
                    isActive
                });
            }

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
            rect.on('dblclick', () => {
                const fieldType = field.type;
                if (!DBL_CLICK_EDIT_TYPE.includes(fieldType)) {
                    return;
                }
                if (toggleEditing) {
                    toggleEditing({
                        aiTable,
                        recordId,
                        fieldId,
                        position: {
                            x: x + offset,
                            y,
                            width,
                            height
                        }
                    });
                }
            });

            placeHolderCells.unshift(rect);
        }
    }
    return placeHolderCells;
};
