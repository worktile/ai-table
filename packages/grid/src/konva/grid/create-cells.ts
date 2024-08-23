import { GRID_ROW_ADD_BUTTON } from '@ai-table/grid';
import Konva from 'konva';
import { GRID_GROUP_OFFSET } from '../constants/grid';
import { Range } from '../core/range';
import { AITableRender, CellType } from '../interface/grid';
import { AIGrid } from '../interface/table';
import { AITableUseGridBaseConfig } from '../interface/view';
import { addRowLayout } from '../utils/add-row-layout';
import { cellHelper } from '../utils/cell-helper';
import { getSelectRanges } from '../utils/cell-range-calc';
import { recordRowLayout } from '../utils/record-row-layout';

/**
 * 根据单元格是否是第一列/最后一列确定单元格所在的位置
 */
export const getCellHorizontalPosition = (props: { depth: number; columnWidth: number; columnIndex: number; columnCount: number }) => {
    const { depth, columnWidth, columnIndex, columnCount } = props;
    if (!depth) return { width: columnWidth, offset: 0 };
    const firstIndent = columnIndex === 0 && depth;
    const lastIndent = columnIndex === columnCount - 1 && depth === 3;
    const offset = firstIndent ? (depth - 1) * GRID_GROUP_OFFSET + 0.5 : 0;
    const width = lastIndent && !firstIndent ? columnWidth - GRID_GROUP_OFFSET : columnWidth - offset;

    return {
        width,
        offset
    };
};

export const createCells = (config: AITableUseGridBaseConfig) => {
    const { context, instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = config;
    const { aiTable, fields, linearRows, pointPosition } = context;
    const { rowIndex: pointRowIndex, columnIndex: pointColumnIndex, targetName } = pointPosition;
    const colors = AIGrid.getThemeColors(aiTable);
    const selectRanges = getSelectRanges(context);
    const selectionRange = selectRanges[0];
    const activeCell = AIGrid.getActiveCell(context);
    const recordRanges = AIGrid.getSelectionRecordRanges(context);
    const fillHandleStatus = AIGrid.getFillHandleStatus(context);
    const visibleColumns = AIGrid.getVisibleColumns(context);

    const { rowHeight, columnCount, rowCount, rowHeightLevel, frozenColumnCount } = instance;

    const cellsDrawer = (ctx: any, columnStartIndex: number, columnStopIndex: number) => {
        cellHelper.initCtx(ctx);
        recordRowLayout.initCtx(ctx);
        addRowLayout.initCtx(ctx);
        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > columnCount - 1) break;
            const field = visibleColumns[columnIndex];
            if (field == null) continue;
            const columnWidth = instance.getColumnWidth(columnIndex);
            const x = instance.getColumnOffset(columnIndex) + 0.5;
            const isLastColumn = columnIndex === fields.length - 1;

            if (columnIndex === 1) {
                cellHelper.initStyle(field, { fontWeight: 'normal' });
            }
            for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                if (rowIndex > rowCount - 1) break;

                const row = linearRows[rowIndex];
                const { recordId, type, depth } = row;
                const y = instance.getRowOffset(rowIndex) + 0.5;
                const height = instance.getRowHeight(rowIndex);

                switch (type) {
                    //  添加行按钮
                    case CellType.Add: {
                        const isHoverColumn = pointColumnIndex === columnIndex;
                        const isHoverRow = pointRowIndex === rowIndex && targetName === GRID_ROW_ADD_BUTTON;
                        addRowLayout.init({
                            x,
                            y,
                            rowIndex,
                            columnIndex,
                            columnWidth,
                            rowHeight: height,
                            columnCount
                        });
                        addRowLayout.render({
                            row,
                            isHoverRow,
                            isHoverColumn,
                            rowCreatable: true
                        });
                        break;
                    }
                    case CellType.Record: {
                        const isCellInSelection = (() => {
                            if (!selectionRange) return false;
                            const currentCell = { recordId, fieldId: field._id };
                            return Range.bindModel(selectionRange).contains(context, currentCell);
                        })();

                        const isActiveRow = Boolean(activeCell && activeCell.recordId === row.recordId);
                        const isHoverRow = pointRowIndex === rowIndex;
                        const isCheckedRow = Boolean(recordRanges && recordRanges.findIndex((item: any) => item === row.recordId) !== -1);
                        const isCellInFillSelection =
                            fillHandleStatus?.fillRange &&
                            Range.bindModel(fillHandleStatus.fillRange).contains(context, {
                                recordId,
                                fieldId: field._id
                            });
                        const isActive = activeCell?.recordId === row.recordId && activeCell?.fieldId === field._id;
                        let background = colors.white;

                        if (isActive) {
                            background = colors.defaultBg;
                        } else if (isCellInFillSelection) {
                            background = colors.warnLight;
                        } else if (isCheckedRow) {
                            background = colors.bgBrandLightDefaultSolid;
                        } else if (isCellInSelection) {
                            background = colors.bgBrandLightDefaultSolid;
                        } else if (isActiveRow) {
                            background = colors.bgBrandLightDefaultSolid;
                        } else if (isHoverRow) {
                            background = colors.bgBglessHoverSolid;
                        }

                        recordRowLayout.init({
                            x,
                            y,
                            rowIndex,
                            columnIndex,
                            columnWidth,
                            rowHeight,
                            columnCount
                        });

                        recordRowLayout.render({ row, style: { fill: background }, isHoverRow, isCheckedRow, isActiveRow, colors });

                        const { width, offset } = getCellHorizontalPosition({
                            depth,
                            columnIndex,
                            columnWidth,
                            columnCount
                        });
                        const realX = x + offset - 0.5;
                        const realY = y - 0.5;
                        const style = { fontWeight: 'normal' };
                        const cellValue = AIGrid.getCellValue(context, recordId, field._id);

                        const render = {
                            x: realX,
                            y: realY,
                            columnWidth: width,
                            rowHeight,
                            recordId: recordId,
                            field,
                            cellValue,
                            style,
                            rowHeightLevel,
                            isActive,
                            colors
                        };

                        cellHelper.initStyle(field, style);
                        // 最后一列的内容需要裁剪，防止溢出
                        if (isLastColumn && cellValue != null) {
                            ctx.save();
                            ctx.rect(realX, realY, width, rowHeight);
                            ctx.clip();
                            cellHelper.renderCellValue(render as AITableRender, ctx);
                            ctx.restore();
                        } else {
                            cellHelper.renderCellValue(render as AITableRender, ctx);
                        }
                    }
                }
            }
        }
    };

    // 冻结列单元格
    const frozenCells = new Konva.Shape({
        listening: false,
        perfectDrawEnabled: false,
        sceneFunc: (ctx: any) => cellsDrawer(ctx, 0, frozenColumnCount - 1)
    });

    // 其他列单元格
    const cells = new Konva.Shape({
        listening: false,
        perfectDrawEnabled: false,
        sceneFunc: (ctx: any) => cellsDrawer(ctx, Math.max(columnStartIndex, frozenColumnCount), columnStopIndex)
    });

    return {
        frozenCells,
        cells
    };
};
