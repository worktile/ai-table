import { AITable, AITableGridRange, AITableRecord, CellType, DefaultTheme } from '@ai-table/grid';
import { Range } from '../core/range';
import { AITableGridCell } from '../interface/grid';
import { AITableGridContext } from '../interface/view';
import { isCellVisible } from '../utils/cell-range-calc';

export const AI_TABLE_TO_ELEMENT_HOST = new WeakMap<
    AITable,
    {
        container: HTMLElement;
    }
>();

export const AIGrid = {
    getContainer(aiTable: AITable): HTMLElement {
        return AI_TABLE_TO_ELEMENT_HOST.get(aiTable)!.container;
    },
    getThemeColors(aiTable: AITable) {
        return DefaultTheme.color;
    },
    getActiveCell(context: AITableGridContext) {
        const { aiTable } = context;
        const activeCell = aiTable.selection()!.activeCell;
        return activeCell ? activeCell : null;
    },
    getVisibleColumns(context: AITableGridContext) {
        const { aiTable } = context;
        return aiTable.fields();
    },
    getVisibleRows(context: AITableGridContext) {
        const { aiTable } = context;
        return aiTable.records();
    },
    getCellValue(context: AITableGridContext, recordId: string, fieldId: string) {
        const { aiTable, records } = context;
        const rowValue = records.find((item: AITableRecord) => item._id === recordId);
        return rowValue ? rowValue.values[fieldId] : null;
    },
    getField(context: AITableGridContext, fieldId: string) {
        const fields = AIGrid.getVisibleColumns(context);
        return fields.find((field) => field._id === fieldId);
    },
    getSelection(context: AITableGridContext) {
        const { aiTable } = context;
        const selection = aiTable && aiTable.selection();

        // 是否移除选中单元格
        if (selection && selection.activeCell && !isCellVisible(context, selection.activeCell)) {
            return null;
        }
        // 移除选择区域的起始处和结束处
        if (selection && selection.ranges) {
            const { start, end } = selection.ranges[0]!;
            if (!isCellVisible(context, start) || !isCellVisible(context, end)) {
                return null;
            }
        }
        return selection;
    },
    getSelectRanges(context: AITableGridContext) {
        const selection = AIGrid.getSelection(context);
        if (!selection || !selection.ranges) {
            return [];
        }
        return selection.ranges;
    },
    getSelectionRecordRanges(context: AITableGridContext) {
        const selection = AIGrid.getSelection(context);
        return selection ? selection.recordRanges : undefined;
    },
    getRangeRecords(context: AITableGridContext, range: AITableGridRange) {
        const rangeIndex = Range.bindModel(range).getIndexRange(context);
        if (!rangeIndex) {
            return null;
        }
        const rowSlice = [rangeIndex.record.min, rangeIndex.record.max + 1];
        const rows = AIGrid.getVisibleRows(context);
        return rows.slice(...rowSlice);
    },
    getFieldRanges(context: AITableGridContext) {
        return AIGrid.getSelection(context)?.fieldRanges;
    },
    getVisibleRowsIndexMap(context: AITableGridContext) {
        return new Map();
    },
    getVisibleColumnsMap(context: AITableGridContext) {
        return new Map();
    },
    getLinearRows(context: AITableGridContext) {
        return new Map();
    },
    getLinearRowsIndexMap(context: AITableGridContext) {
        return new Map();
    },
    getPureVisibleRows(context: AITableGridContext) {
        const { aiTable } = context;
        return aiTable.records();
    },
    getPureVisibleRowsIndexMap(context: AITableGridContext) {
        return new Map();
    },
    getCellIndex(context: AITableGridContext, cell: AITableGridCell): { recordIndex: number; fieldIndex: number } | null {
        const visibleRowIndexMap = AIGrid.getVisibleRowsIndexMap(context);
        const visibleColumnIndexMap = AIGrid.getVisibleColumnsMap(context);
        if (isCellVisible(context, cell)) {
            return {
                recordIndex: visibleRowIndexMap.get(cell.recordId)!,
                fieldIndex: visibleColumnIndexMap.get(cell.fieldId)!
            };
        }
        return null;
    },
    getCellUIIndex(context: AITableGridContext, cell: AITableGridCell): { rowIndex: number; columnIndex: number } | null {
        const visibleColumnIndexMap = AIGrid.getVisibleColumnsMap(context);
        const linearRowIndexMap = AIGrid.getLinearRowsIndexMap(context);
        if (isCellVisible(context, cell)) {
            return {
                rowIndex: linearRowIndexMap!.get(`${CellType.Record}_${cell.recordId}`)!,
                columnIndex: visibleColumnIndexMap.get(cell.fieldId)!
            };
        }
        return null;
    },
    getCellByIndex(
        context: AITableGridContext,
        cellIndex: {
            recordIndex: number;
            fieldIndex: number;
        }
    ) {
        const { recordIndex, fieldIndex } = cellIndex;
        const visibleRows = AIGrid.getVisibleRows(context);
        const visibleColumns = AIGrid.getVisibleColumns(context);
        const cell = {
            recordId: visibleRows[recordIndex]!._id,
            fieldId: visibleColumns[fieldIndex]!._id
        };
        if (isCellVisible(context, cell)) {
            return cell;
        }
        return null;
    },
    isCellInSelection(context: AITableGridContext, cell: AITableGridCell): boolean {
        const selection = AIGrid.getSelection(context);
        if (!selection) {
            return false;
        }
        if (!selection.ranges) {
            const selectedRecordIds = AIGrid.getSelectRecordIds(context);
            const inSelectRecords = new Set(selectedRecordIds).has(cell.recordId);
            return inSelectRecords;
        }
        return selection.ranges.some((range) => {
            return Range.bindModel(range).contains(context, cell);
        });
    },
    // 获取所选的记录集合，无论是通过复选框还是范围选择
    getSelectRecordIds(context: AITableGridContext) {
        const ranges = AIGrid.getSelectRanges(context);
        const checkedRecordIds = AIGrid.getSelectionRecordRanges(context);
        const range = ranges[0];

        // 如果存在选择区域，返回该区域内所选的记录
        if (range) {
            const rangeRecords = AIGrid.getRangeRecords(context, range);
            return rangeRecords ? rangeRecords.map((row) => row._id) : [];
        }
        // 否则，返回已勾选的记录
        return checkedRecordIds || [];
    },
    getFillHandleStatus(context: AITableGridContext) {
        const selection = AIGrid.getSelection(context);
        return selection?.fillHandleStatus;
    }
};
