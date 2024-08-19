import {
    AILinearRow,
    AITable,
    AITableFieldType,
    AITableGridContext,
    AITableRecord,
    AITableScrollState,
    CellType,
    Coordinate,
    GRID_CELL,
    GRID_GROUP_OFFSET
} from '@ai-table/grid';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { CellValue } from '../components/cell/cell';
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
    scrollState: AITableScrollState;
    linearRows: AILinearRow[];
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
    const { context, instance, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex, scrollState, linearRows } = props;
    const { aiTable, fields, records, activeCellBound, pointPosition } = context;
    const { rowHeight, rowHeightLevel, columnCount, rowCount, frozenColumnCount, rowInitSize } = instance;
    const colors = AITable.getThemeColors(aiTable());
    const activeCell = aiTable().selection().activeCell;
    const { isScrolling } = scrollState;

    const totalColumnCount = fields.length;
    const activeCellHeight = activeCellBound!().height!;

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
            const { rowIndex, columnIndex } = pointPosition();
            if (rowIndex != null && columnIndex != null && checkIsVisible(rowIndex, columnIndex)) {
                const { recordId, type, depth } = linearRows[rowIndex];

                if (type === CellType.Record) {
                    const activeField = fields().find((field) => field._id === fieldId);
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
                    const rowValue = records().find((item: AITableRecord) => item._id === recordId);
                    const cellValue = rowValue?.values[activeField._id];
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

    const getPlaceHolderCellsByColumnIndex = (columnStartIndex: number, columnStopIndex: number) => {
        const tempCells: any[] = [];

        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            if (columnIndex > columnCount - 1) return EMPTY_ARRAY;
            const field = fields()[columnIndex];
            const fieldId = field._id;
            if (field == null) return EMPTY_ARRAY;
            const x = instance.getColumnOffset(columnIndex) + 0.5;
            const columnWidth = instance.getColumnWidth(columnIndex);

            for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                if (rowIndex > rowCount - 1) break;

                const row = linearRows[rowIndex];
                const { recordId, type, depth } = row;

                const y = instance.getRowOffset(rowIndex) + 0.5;
                const { width, offset } = getCellHorizontalPosition({
                    depth,
                    columnWidth,
                    columnIndex,
                    columnCount
                });
                let height = rowHeight;

                if (true) {
                    height = getCellHeight({
                        field,
                        rowHeight,
                        activeHeight: activeCellHeight,
                        isActive: true
                    });
                }

                const rect = new Konva.Rect({
                    name: generateTargetName({
                        targetName: GRID_CELL,
                        fieldId,
                        recordId,
                        mouseStyle: 'pointer'
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
                    shadowEnabled: false,
                    listening: false
                });
                rect.on('dblclick', (e: KonvaEventObject<MouseEvent>) => {});
                rect.on('mousedown', (e: KonvaEventObject<MouseEvent>) => {});
                rect.on('tap', (e: KonvaEventObject<MouseEvent>) => {});
                tempCells.push(rect);
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

    return {
        ...activeCellMap,
        placeHolderCells,
        frozenPlaceHolderCells
    };
};
