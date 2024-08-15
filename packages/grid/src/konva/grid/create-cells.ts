import Konva from 'konva';
import { DefaultTheme } from '../constants/default-theme';
import { GRID_GROUP_OFFSET } from '../constants/grid';
import { cellHelper } from '../core/cell-helper';
import { AITableRender } from '../interface/grid';
import { AITableUseGridBaseConfig } from '../interface/view';
import { recordRowLayout } from '../layouts/record-row-layout';

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
    const { fields, records } = context;
    const colors = DefaultTheme.colors;

    const { rowHeight, columnCount, rowCount, rowHeightLevel, frozenColumnCount } = instance;

    const cellsDrawer = (ctx: any, columnStartIndex: number, columnStopIndex: number) => {
        cellHelper.initCtx(ctx);
        recordRowLayout.initCtx(ctx);

        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > columnCount - 1) break;
            const field = fields[columnIndex];
            if (field == null) continue;
            const columnWidth = instance.getColumnWidth(columnIndex);
            const x = instance.getColumnOffset(columnIndex) + 0.5;
            const isLastColumn = columnIndex === fields.length - 1;

            if (columnIndex === 1) {
                cellHelper.initStyle(field, { fontWeight: 'normal' });
            }
            for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                if (rowIndex > rowCount - 1) break;

                const row = records[rowIndex];
                const depth = 0;
                const y = instance.getRowOffset(rowIndex) + 0.5;
                let background = colors.white;

                recordRowLayout.init({
                    x,
                    y,
                    rowIndex,
                    columnIndex,
                    columnWidth,
                    rowHeight,
                    columnCount
                });
                recordRowLayout.render({ row, style: { fill: background }, colors });
                const { width, offset } = getCellHorizontalPosition({
                    depth,
                    columnIndex,
                    columnWidth,
                    columnCount
                });
                const realX = x + offset - 0.5;
                const realY = y - 0.5;
                const style = { fontWeight: 'normal' };
                const cellValue = row.values[field._id];

                const render = {
                    x: realX,
                    y: realY,
                    columnWidth: width,
                    rowHeight,
                    recordId: row._id,
                    field,
                    cellValue,
                    style,
                    rowHeightLevel,
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
    };

    // 冻结列单元格
    const frozenCells = new Konva.Shape({
        sceneFunc: (ctx: any) => cellsDrawer(ctx, 0, frozenColumnCount - 1)
    });

    // 其他列单元格
    const cells = new Konva.Shape({
        sceneFunc: (ctx: any) => cellsDrawer(ctx, Math.max(columnStartIndex, frozenColumnCount), columnStopIndex)
    });

    return {
        frozenCells,
        cells
    };
};
