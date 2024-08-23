import {
    AITableFieldType,
    AITableGridContext,
    CellType,
    Coordinate,
    GRID_CELL,
    GRID_CELL_FILL_HANDLER,
    GRID_FILL_HANDLER_SIZE,
    GRID_GROUP_OFFSET,
    MouseDownType
} from '@ai-table/grid';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { isEqual } from 'lodash';
import { CellValue } from '../components/cell/cell';
import { Range } from '../core/range';
import { AIGrid } from '../interface/table';
import { getCellHeight } from '../utils/calc';
import { cellHelper } from '../utils/cell-helper';
import { generateTargetName } from '../utils/helper';

const TOOLTIP_TEXT_MAP = {
    [AITableFieldType.createdBy]: '这个字段无法编辑',
    [AITableFieldType.updatedBy]: '这个字段无法编辑',
    [AITableFieldType.createdAt]: '这个字段无法编辑',
    [AITableFieldType.updatedAt]: '这个字段无法编辑'
};

const TOOLTIP_VISIBLE_SET = new Set([
    AITableFieldType.createdBy,
    AITableFieldType.updatedBy,
    AITableFieldType.createdAt,
    AITableFieldType.updatedAt
]);

const TRANSPARENT_FIELD_TYPES = new Set([AITableFieldType.number, AITableFieldType.progress]);

const EMPTY_ARRAY: any[] = [];

interface AIGridDynamicCells {
    context: AITableGridContext;
    instance: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    columnStartIndex: number;
    columnStopIndex: number;
}

/**
 * 根据单元格是否位于第一列/最后一列来确定其位置
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

export const createDynamicCells = (props: AIGridDynamicCells) => {
    const { context, instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = props;
    const { aiTable, fields, records, activeCellBound, pointPosition, scrollState, linearRows } = context;
    const { rowHeight, rowHeightLevel, columnCount, rowCount, frozenColumnCount, rowInitSize } = instance;
    const colors = AIGrid.getThemeColors(aiTable);
    const activeCell = AIGrid.getActiveCell(context);
    const visibleColumns = AIGrid.getVisibleColumns(context);
    const selectRanges = AIGrid.getSelectRanges(context);
    const { isScrolling } = scrollState;

    const totalColumnCount = visibleColumns.length;
    const activeCellHeight = activeCellBound.height;

    const checkIsVisible = (rowIndex: number, columnIndex: number) => {
        if (columnIndex < frozenColumnCount) return true;
        return rowIndex >= rowStartIndex && rowIndex <= rowStopIndex && columnIndex >= columnStartIndex && columnIndex <= columnStopIndex;
    };

    /**
     * 活动单元格，活动边框
     */
    const activeCellMap = (() => {
        let activedCell = null;
        let activeCellBorder = null;
        let frozenActivedCell = null;
        let frozenActiveCellBorder = null;

        if (activeCell != null) {
            const { recordId, fieldId } = activeCell;
            const { rowIndex, columnIndex } = pointPosition;
            if (rowIndex != null && columnIndex != null && checkIsVisible(rowIndex, columnIndex)) {
                const { recordId, type, depth } = linearRows[rowIndex];

                if (type === CellType.Record) {
                    const activeField = AIGrid.getField(context, fieldId);
                    if (activeField == null) {
                        return {
                            activedCell,
                            activeCellBorder,
                            frozenActivedCell,
                            frozenActiveCellBorder
                        };
                    }
                    const x = instance.getColumnOffset(columnIndex);
                    const y = instance.getRowOffset(rowIndex);
                    const columnWidth = instance.getColumnWidth(columnIndex);
                    const cellValue = AIGrid.getCellValue(context, recordId, fieldId);
                    const isFrozenColumn = columnIndex < frozenColumnCount;
                    const { offset, width } = getCellHorizontalPosition({
                        depth,
                        columnWidth,
                        columnIndex,
                        columnCount: totalColumnCount
                    });
                    let isCurrentSearchCell = false;

                    const editable = false;
                    const fontWeight = 'normal';

                    const renderProps = {
                        x: x + offset,
                        y,
                        columnWidth: width,
                        rowHeight,
                        recordId,
                        field: activeField,
                        cellValue,
                        editable,
                        isActive: true,
                        rowHeightLevel,
                        style: {
                            fontWeight
                        } as any,
                        colors
                    };

                    cellHelper.needDraw = false;
                    cellHelper.initStyle(activeField, { fontWeight });
                    const renderData = cellHelper.renderCellValue(renderProps);
                    const height = getCellHeight({
                        field: activeField,
                        rowHeight,
                        activeHeight: activeCellHeight,
                        isActive: true
                    });

                    const currentCell = [];

                    if (TRANSPARENT_FIELD_TYPES.has(activeField.type)) {
                        const rect = new Konva.Rect({
                            x: x + offset,
                            y,
                            width,
                            height,
                            fill: colors.defaultBg,
                            listening: false
                        });
                        currentCell.push(rect);
                    }
                    const cellView = CellValue({
                        context,
                        x: x + offset,
                        y,
                        columnWidth: width,
                        rowHeight,
                        recordId,
                        renderData,
                        cellValue,
                        field: activeField,
                        isActive: true,
                        editable
                    });
                    currentCell.push(cellView);

                    const currentCellBorder = new Konva.Rect({
                        x: x + offset,
                        y,
                        width: width + 1,
                        height,
                        fillEnabled: false,
                        stroke: colors.primaryColor,
                        strokeWidth: 2,
                        cornerRadius: 2,
                        listening: false
                    });

                    if (isFrozenColumn) {
                        frozenActivedCell = currentCell;
                        frozenActiveCellBorder = currentCellBorder;
                    } else {
                        activedCell = currentCell;
                        activeCellBorder = currentCellBorder;
                    }
                }
            }
        }

        return {
            activedCell,
            activeCellBorder,
            frozenActivedCell,
            frozenActiveCellBorder
        };
    })();

    /**
     * Drag handler
     */
    let fillHandler = null;
    let frozenFillHandler = null;

    const onMouseDown = (e: any, field: any, isActive: any) => {
        if (e.evt.button === MouseDownType.Right) return;
        if (![AITableFieldType.select, AITableFieldType.member].includes(field?.type)) return;
        // TODO: 支持编辑的字段类型
    };

    const getPlaceHolderCellsByColumnIndex = (columnStartIndex: number, columnStopIndex: number) => {
        const tempCells: any[] = [];

        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > columnCount - 1) return EMPTY_ARRAY;
            const field = visibleColumns[columnIndex];
            const fieldId = field._id;
            if (field == null) return EMPTY_ARRAY;
            const x = instance.getColumnOffset(columnIndex) + 0.5;
            const columnWidth = instance.getColumnWidth(columnIndex);

            for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                if (rowIndex > rowCount - 1) break;

                const row = linearRows[rowIndex];
                const { recordId, type, depth } = row;
                if (type !== CellType.Record) continue;

                const y = instance.getRowOffset(rowIndex) + 0.5;
                const { width, offset } = getCellHorizontalPosition({
                    depth,
                    columnWidth,
                    columnIndex,
                    columnCount
                });
                const isActive = isEqual(activeCell, { fieldId, recordId });
                let height = rowHeight;

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
                        targetName: GRID_CELL,
                        fieldId,
                        recordId
                    }),
                    x: x + offset,
                    y,
                    width,
                    height,
                    fill: 'transparent',
                    strokeEnabled: false,
                    hitStrokeWidth: 0,
                    transformsEnabled: 'position',
                    perfectDrawEnabled: false,
                    shadowEnabled: false
                });
                rect.on('dblclick', (e: KonvaEventObject<MouseEvent>) => {});
                rect.on('mousedown', (e: KonvaEventObject<MouseEvent>) => onMouseDown(e, field, isActive));
                rect.on('tap', (e: KonvaEventObject<MouseEvent>) => onMouseDown(e, field, isActive));
                tempCells.unshift(rect);
            }
        }
        return tempCells;
    };

    const placeHolderCells = (() => {
        if (isScrolling) return null;
        return getPlaceHolderCellsByColumnIndex(columnStartIndex, columnStopIndex);
    })();

    const frozenPlaceHolderCells = (() => {
        if (isScrolling) return null;
        return getPlaceHolderCellsByColumnIndex(0, frozenColumnCount - 1);
    })();

    if (selectRanges.length) {
        const selectionRange = selectRanges[0];
        if (selectionRange != null) {
            const fillHandleCellIndex = Range.bindModel(selectionRange).getUIIndexRange(context);
            const { min: recordMinIndex, max: recordMaxIndex } = fillHandleCellIndex?.record || {
                min: null,
                max: null
            };
            const { min: fieldMinIndex, max: fieldMaxIndex } = fillHandleCellIndex?.field || {
                min: null,
                max: null
            };
            if (recordMaxIndex != null && !isNaN(recordMaxIndex) && fieldMaxIndex != null && !isNaN(fieldMaxIndex)) {
                const maxIndexColumn = visibleColumns[fieldMaxIndex];
                if (!maxIndexColumn) return;
                const { fieldId } = maxIndexColumn;
                const maxIndexField = AIGrid.getField(context, fieldId);
                const isCellEditable = false;
                // 计算字段不呈现拖动处理程序；
                if (isCellEditable) {
                    const x = instance.getColumnOffset(fieldMaxIndex);
                    const y = instance.getRowOffset(recordMaxIndex);
                    const isSingleCell = recordMinIndex === recordMaxIndex && fieldMinIndex === fieldMaxIndex;
                    const activeField = AIGrid.getField(context, activeCell!.fieldId);
                    const cellHeight = getCellHeight({
                        field: activeField,
                        rowHeight,
                        activeHeight: activeCellBound.height,
                        isActive: isSingleCell
                    });
                    const columnWidth = instance.getColumnWidth(fieldMaxIndex);
                    const { depth } = linearRows[recordMaxIndex];
                    const { width, offset } = getCellHorizontalPosition({
                        depth,
                        columnWidth,
                        columnIndex: fieldMaxIndex,
                        columnCount: totalColumnCount
                    });
                    const currentHandler = new Konva.Rect({
                        name: GRID_CELL_FILL_HANDLER,
                        x: x - GRID_FILL_HANDLER_SIZE / 2 - 0.5 + width + offset,
                        y: y + cellHeight - GRID_FILL_HANDLER_SIZE / 2 - 0.5,
                        width: GRID_FILL_HANDLER_SIZE,
                        height: GRID_FILL_HANDLER_SIZE,
                        stroke: colors.primaryColor,
                        strokeWidth: 0.5
                    });

                    // select section with workdoc field cannot be filled
                    let selectWithWorkdocField = false;
                    if (selectWithWorkdocField) {
                        fillHandler = null;
                    } else if (fieldMaxIndex < frozenColumnCount) {
                        frozenFillHandler = currentHandler;
                    } else {
                        fillHandler = currentHandler;
                    }
                }
            }
        }
    }

    return {
        ...activeCellMap,
        fillHandler,
        frozenFillHandler,
        placeHolderCells,
        frozenPlaceHolderCells
    };
};
