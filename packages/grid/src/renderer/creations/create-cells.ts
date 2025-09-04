import { AIRecordFieldIdPath } from '@ai-table/utils';
import {
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_ADD_BUTTON,
    DEFAULT_FONT_STYLE
} from '../../constants';
import { AITable, AITableQueries, RendererContext } from '../../core';
import { AITableCellsDrawerConfig, AITableLinearRowGroup, AITableRender, AITableRenderStyle, AITableRowType } from '../../types';
import { FieldModelMap, getCellHorizontalPosition, getCoverCell } from '../../utils';
import { addRowLayout } from '../drawers/add-row-layout-drawer';
import { cellDrawer } from '../drawers/cell-drawer';
import { recordRowLayout } from '../drawers/record-row-layout-drawer';
import { groupLayout } from '../drawers/group-layout';

/**
 * 绘制单元格内容的函数
 * 利用 Canvas API 绘制每个单元格的背景颜色、文本以及其他可能的样式。这个函数通常用于自定义表格渲染，尤其是在处理大量数据时，通过直接操作 Canvas 来提高渲染性能
 * @param config
 */
export const createCells = (config: AITableCellsDrawerConfig) => {
    const { aiTable, coordinate, references, ctx, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, maxRecords } = config;
    const context = aiTable.context as RendererContext;
    const { rowHeight, columnCount, rowCount } = coordinate;
    const colors = AITable.getColors();
    const visibleColumns = AITable.getVisibleFields(aiTable);

    const xIsScroll = aiTable!.context!.scrollState().scrollLeft > 0;

    // 初始化绘图上下文, 为后续的绘制操作做准备
    cellDrawer.initCtx(ctx as CanvasRenderingContext2D);
    addRowLayout.initCtx(ctx as CanvasRenderingContext2D);
    recordRowLayout.initCtx(ctx as CanvasRenderingContext2D);
    groupLayout.initCtx(ctx as CanvasRenderingContext2D);

    const coverCell = getCoverCell(aiTable);

    const frozenColumnCount = aiTable.context?.frozenColumnCount() || 1;

    // 遍历列, 确定在哪些列上绘制单元格
    for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
        if (columnIndex > columnCount - 1) break;

        // 获取该列对应的 field，如果 field 不再展示范围，则跳过该列
        const field = visibleColumns[columnIndex];
        if (field == null) continue;

        // 获取该列对应的宽度
        const columnWidth = coordinate.getColumnWidth(columnIndex);
        const x = coordinate.getColumnOffset(columnIndex) + AI_TABLE_OFFSET;
        const isLastColumn = columnIndex === aiTable.gridData().fields?.length - 1;

        if (columnIndex === 1) {
            cellDrawer.initStyle(field, { fontWeight: DEFAULT_FONT_STYLE });
        }

        // 遍历行, 从 rowStartIndex 到 rowStopIndex 的所有行，决定将在哪些行上绘制单元格
        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
            if (rowIndex > rowCount - 1) break;
            const row = context.linearRows()[rowIndex];
            const { _id: recordId, type, depth = 0 } = row;
            const y = coordinate.getRowOffset(rowIndex) + AI_TABLE_OFFSET;
            const { rowIndex: pointRowIndex, targetName } = context.pointPosition();
            const isHover = pointRowIndex === rowIndex;

            switch (type) {
                case AITableRowType.add: {
                    const isHoverRow = isHover && targetName === AI_TABLE_ROW_ADD_BUTTON;
                    const isCheckedRow = aiTable.selection().selectedRecords.has(row._id);
                    addRowLayout.init({
                        x,
                        y,
                        rowIndex,
                        columnIndex,
                        columnWidth,
                        rowHeight: AI_TABLE_FIELD_HEAD_HEIGHT,
                        columnCount,
                        containerWidth: coordinate.containerWidth,
                        rowHeadWidth: context.rowHeadWidth(),
                        hiddenIndexColumn: !!context.aiFieldConfig()?.hiddenIndexColumn,
                        hiddenRowDrag: !!context.aiFieldConfig()?.hiddenRowDrag,
                        readonly: aiTable.context?.readonly?.(),
                        frozenColumnCount
                    });
                    addRowLayout.render({
                        isHoverRow,
                        isCheckedRow,
                        isDisabled: maxRecords ? aiTable.records().length >= maxRecords : false
                    });
                    break;
                }

                case AITableRowType.record: {
                    const fieldId = field._id;
                    const cell: AIRecordFieldIdPath = [recordId, fieldId];
                    let background = getCellBackground(cell, isHover, targetName, aiTable);
                    let indexBackground = getIndexCellBackground(cell, isHover, targetName, aiTable);

                    recordRowLayout.init({
                        x,
                        y,
                        rowIndex,
                        columnIndex,
                        columnWidth,
                        rowHeight,
                        columnCount,
                        containerWidth: coordinate.containerWidth,
                        rowHeadWidth: context.rowHeadWidth(),
                        hiddenIndexColumn: !!context.aiFieldConfig()?.hiddenIndexColumn,
                        hiddenRowDrag: !!context.aiFieldConfig()?.hiddenRowDrag,
                        readonly: aiTable.context?.readonly?.(),
                        frozenColumnCount,
                        xIsScroll
                    });
                    recordRowLayout.render({
                        row,
                        style: { fill: background },
                        indexStyle: { fill: indexBackground },
                        isHoverRow: isHoverRecord(isHover, targetName),
                        isCheckedRow: isSelectedRecord(recordId, aiTable)
                    });
                    const isGroupAndFirstColumn = depth > 0 && columnIndex === 0;
                    const { width, offset } = getCellHorizontalPosition({
                        columnIndex,
                        columnWidth: isGroupAndFirstColumn ? columnWidth - AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE : columnWidth,
                        columnCount,
                        depth
                    });
                    let realX = x + offset + AI_TABLE_OFFSET;
                    if (isGroupAndFirstColumn) {
                        realX += AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE;
                    }
                    const realY = y + AI_TABLE_OFFSET;
                    const style = { fontWeight: DEFAULT_FONT_STYLE };
                    const cellValue = AITableQueries.getFieldValue(aiTable, [recordId, fieldId]);
                    const fieldModel = FieldModelMap[field.type];
                    const transformValue = fieldModel.transformCellValue(cellValue, { aiTable, field });
                    const render = {
                        aiTable,
                        x: realX,
                        y: realY,
                        columnWidth: width,
                        rowHeight,
                        recordId: recordId,
                        field,
                        cellValue,
                        transformValue,
                        references,
                        isActive: isSelectedField(fieldId, aiTable),
                        style,
                        colors,
                        isCoverCell: false
                    };
                    // hover 组件渲染时，底层的 cell 渲染为空
                    if (coverCell && coverCell.recordId === recordId && coverCell.fieldId === fieldId) {
                        render.cellValue = '';
                        render.transformValue = '';
                        render.isCoverCell = true;
                    }

                    cellDrawer.initStyle(field, style);
                    // 最后一列，且单元格内容存在，需要裁剪内容，以防止文本溢出单元格边界
                    // 然后，根据计算好的样式和布局绘制单元格内容
                    if (isLastColumn && cellValue != null) {
                        ctx.save();
                        ctx.rect(realX, realY, width, rowHeight);
                        ctx.clip();
                        cellDrawer.renderCell(render as AITableRender, ctx as CanvasRenderingContext2D, columnWidth);
                        ctx.restore();
                    } else {
                        cellDrawer.renderCell(render as AITableRender, ctx as CanvasRenderingContext2D, columnWidth);
                    }
                    break;
                }

                case AITableRowType.group: {
                    const fieldId = row.fieldId;
                    const field = aiTable.fieldsMap()[fieldId];
                    groupLayout.init({
                        x,
                        y,
                        rowIndex,
                        columnIndex,
                        columnWidth,
                        rowHeight,
                        columnCount,
                        containerWidth: coordinate.containerWidth,
                        rowHeadWidth: context.rowHeadWidth(),
                        hiddenIndexColumn: !!context.aiFieldConfig()?.hiddenIndexColumn,
                        hiddenRowDrag: !!context.aiFieldConfig()?.hiddenRowDrag,
                        readonly: aiTable.context?.readonly?.(),
                        frozenColumnCount,
                        xIsScroll
                    });

                    const { width, offset } = getCellHorizontalPosition({
                        columnIndex,
                        columnWidth,
                        columnCount,
                        depth
                    });
                    const realX = x + offset + AI_TABLE_OFFSET;
                    const realY = y + AI_TABLE_OFFSET;
                    const style = { fontWeight: DEFAULT_FONT_STYLE };
                    const cellValue = row.groupValue;
                    const fieldModel = FieldModelMap[field.type];
                    const transformValue = fieldModel.transformCellValue(cellValue, { aiTable, field });
                    const render = {
                        aiTable,
                        x: realX,
                        y: realY,
                        columnWidth: width,
                        rowHeight,
                        recordId: recordId,
                        field,
                        cellValue,
                        transformValue,
                        references,
                        isActive: isSelectedField(fieldId, aiTable),
                        style,
                        colors,
                        isCoverCell: false
                    };

                    groupLayout.render(render as AITableRender, {
                        row: row as AITableLinearRowGroup,
                        isHoverRow: isHoverRecord(isHover, targetName),
                        isCheckedRow: isSelectedRecord(recordId, aiTable)
                    });
                }
            }
        }
    }
};

const getRowBackground = (cell: AIRecordFieldIdPath, isHover: boolean, targetName: string, aiTable: AITable): string => {
    const colors = AITable.getColors();
    const [recordId, fieldId] = cell;
    if (isWillHiddenCell(cell, aiTable)) {
        return colors.itemMatchBgColor;
    }

    if (isSelectedRecord(recordId, aiTable) || isSiblingCell(cell, aiTable)) {
        return colors.itemActiveBgColor;
    }

    if (isHoverRecord(isHover, targetName)) {
        return colors.gray80;
    }
    return colors.white;
};

const getCellBackground = (cell: AIRecordFieldIdPath, isHover: boolean, targetName: string, aiTable: AITable): string => {
    const colors = AITable.getColors();
    const [recordId, fieldId] = cell;
    if (isActiveCell(cell, aiTable)) {
        return colors.white;
    }
    if (isSelectedField(fieldId, aiTable) || isSelectedCell(cell, aiTable)) {
        return colors.itemActiveBgColor;
    }
    if (isKeywordsMatchedCell(cell, aiTable)) {
        return colors.itemMatchBgColor;
    }

    return getRowBackground(cell, isHover, targetName, aiTable);
};

const getIndexCellBackground = (cell: AIRecordFieldIdPath, isHover: boolean, targetName: string, aiTable: AITable): string => {
    const [recordId, fieldId] = cell;
    return getRowBackground([recordId, ''], isHover, targetName, aiTable);
};

export const isActiveCell = (cell: AIRecordFieldIdPath, aiTable: AITable): boolean => {
    const [recordId, fieldId] = cell;
    const [activeRecordId, activeFieldId] = AITable.getActiveCell(aiTable) || [];
    return recordId === activeRecordId && fieldId === activeFieldId;
};

const isSiblingCell = (cell: AIRecordFieldIdPath, aiTable: AITable): boolean => {
    const [recordId, fieldId] = cell;
    const [activeRecordId, activeFieldId] = AITable.getActiveCell(aiTable) || [];
    return AITable.getActiveRecordIds(aiTable).length === 1 && recordId === activeRecordId && fieldId !== activeFieldId;
};

const isKeywordsMatchedCell = (cell: AIRecordFieldIdPath, aiTable: AITable): boolean => {
    const [recordId, fieldId] = cell;
    return aiTable.keywordsMatchedCells().has(`${recordId}:${fieldId}`);
};

const isWillHiddenCell = (cell: AIRecordFieldIdPath, aiTable: AITable): boolean => {
    const [recordId, fieldId] = cell;
    return aiTable.recordsWillHidden().includes(recordId);
};

const isSelectedCell = (cell: AIRecordFieldIdPath, aiTable: AITable): boolean => {
    const [recordId, fieldId] = cell;
    return aiTable.selection().selectedCells.has(`${recordId}:${fieldId}`);
};

export const isSelectedField = (fieldId: string, aiTable: AITable): boolean => {
    return aiTable.selection().selectedFields.has(fieldId);
};

const isSelectedRecord = (recordId: string, aiTable: AITable): boolean => {
    return aiTable.selection().selectedRecords.has(recordId);
};

const isHoverRecord = (isHover: boolean, targetName: string): boolean => {
    return isHover && targetName !== AI_TABLE_FIELD_HEAD;
};
