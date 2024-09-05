import { AI_TABLE_OFFSET, DEFAULT_FONT_STYLE } from '../../constants';
import { AITable } from '../../core';
import { AITableCellsDrawerOptions, AITableRender, AITableRowType } from '../../types';
import { getCellHorizontalPosition } from '../../utils';
import { cellDrawer } from '../drawers/cell-drawer';
import { rowLayoutDrawer } from '../drawers/row-layout-drawer';

/**
 * 绘制单元格内容的函数
 * 利用 Canvas API 绘制每个单元格的背景颜色、文本以及其他可能的样式。这个函数通常用于自定义表格渲染，尤其是在处理大量数据时，通过直接操作 Canvas 来提高渲染性能
 * @param options
 */
export const createCells = (options: AITableCellsDrawerOptions) => {
    const { aiTable, context, instance, ctx, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = options;
    const { fields } = aiTable;
    const { linearRows } = context;
    const { rowHeight, columnCount, rowCount } = instance;
    const colors = AITable.getColors();
    const visibleColumns = AITable.getVisibleFields(aiTable);

    // 初始化绘图上下文, 为后续的绘制操作做准备
    cellDrawer.initCtx(ctx as CanvasRenderingContext2D);
    rowLayoutDrawer.initCtx(ctx as CanvasRenderingContext2D);

    // 遍历列, 确定在哪些列上绘制单元格
    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        if (columnIndex > columnCount - 1) break;

        // 获取该列对应的 field，如果 field 不再展示范围，则跳过该列
        const field = visibleColumns[columnIndex];
        if (field == null) continue;

        // 获取该列对应的宽度
        const columnWidth = instance.getColumnWidth(columnIndex);
        const x = instance.getColumnOffset(columnIndex) + AI_TABLE_OFFSET;
        const isLastColumn = columnIndex === fields.length - 1;

        if (columnIndex === 1) {
            cellDrawer.initStyle(field, { fontWeight: DEFAULT_FONT_STYLE });
        }

        // 遍历行, 从 rowStartIndex 到 rowStopIndex 的所有行，决定将在哪些行上绘制单元格
        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
            if (rowIndex > rowCount - 1) break;

            const row = linearRows[rowIndex];
            const { _id: recordId, type } = row;
            const y = instance.getRowOffset(rowIndex) + AI_TABLE_OFFSET;

            switch (type) {
                case AITableRowType.record: {
                    let background = colors.white;
                    // 使用 recordRowLayout 设置每个单元格的布局，并调用其 render 方法实际绘制单元格背景
                    rowLayoutDrawer.init({
                        x,
                        y,
                        rowIndex,
                        columnIndex,
                        columnWidth,
                        rowHeight,
                        columnCount
                    });
                    rowLayoutDrawer.render({ row, style: { fill: background } });

                    const { width, offset } = getCellHorizontalPosition({
                        columnIndex,
                        columnWidth,
                        columnCount
                    });
                    const realX = x + offset - AI_TABLE_OFFSET;
                    const realY = y - AI_TABLE_OFFSET;
                    const style = { fontWeight: DEFAULT_FONT_STYLE };
                    const cellValue = AITable.getCellValue(aiTable, recordId, field._id);
                    const render = {
                        x: realX,
                        y: realY,
                        columnWidth: width,
                        rowHeight,
                        recordId: recordId,
                        field,
                        cellValue,
                        style,
                        colors
                    };

                    cellDrawer.initStyle(field, style);
                    // 最后一列，且单元格内容存在，需要裁剪内容，以防止文本溢出单元格边界
                    // 然后，根据计算好的样式和布局绘制单元格内容
                    if (isLastColumn && cellValue != null) {
                        ctx.save();
                        ctx.rect(realX, realY, width, rowHeight);
                        ctx.clip();
                        cellDrawer.renderCell(render as AITableRender, ctx as CanvasRenderingContext2D);
                        ctx.restore();
                    } else {
                        cellDrawer.renderCell(render as AITableRender, ctx as CanvasRenderingContext2D);
                    }
                }
            }
        }
    }
};
