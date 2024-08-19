import { AITableGridCell, AITableGridFieldRanges, AITableGridFillHandleStatus, AITableGridRange } from '@ai-table/grid';
import { getFillHandleStatus } from '../utils/cell-range-calc';
import { AITableGridContext } from './../interface/view';

/**
 * set the selection area
 * @param ranges
 * @returns
 */
export const setSelection = (context: AITableGridContext, ranges: AITableGridRange | AITableGridRange[]) => {
    const { aiTable } = context;
    const selection = aiTable()!.selection;
    const payload = Array.isArray(ranges) ? ranges : [ranges];
    const range = payload[0]!;

    if (!selection() || !selection().ranges || !selection().activeCell) {
        aiTable().selection().activeCell = range.start;
        aiTable().selection().ranges = payload;
        return;
    }

    aiTable().selection().ranges = payload;
};

/**
 * 设置选中 cell
 * @param cell
 * @returns
 */
export const setActiveCell = (context: AITableGridContext, cell: AITableGridCell) => {
    const { aiTable } = context;

    aiTable().selection().activeCell = cell;
    // 当激活单元格时，选择区域等于活动单元格本身的向量
    aiTable().selection().ranges = [{ start: cell, end: cell }];
};

/**
 * set current selected columns
 *
 * @param context
 * @param payload
 * @returns
 */
export const setFieldRanges = (context: AITableGridContext, payload: AITableGridFieldRanges) => {
    const { aiTable } = context;
    aiTable().selection().fieldRanges = payload;
};

/**
 * clear the data in selection area
 *
 * @returns
 */
export const clearSelection = (context: AITableGridContext) => {
    const { aiTable } = context;
    aiTable().selection().activeCell = undefined;
    aiTable().selection().ranges = [];
    aiTable().selection().fieldRanges = [];
    aiTable().selection().fillHandleStatus = undefined;
    aiTable().selection().recordRanges = [];
};

type AITableGridSetFillHandleStatus = Omit<AITableGridFillHandleStatus, 'fillRange'> & { hoverCell?: AITableGridCell };

/**
 * set the Fill Handle active status
 *
 * @param payload
 * @returns
 */
export const setFillHandleStatus = (context: AITableGridContext, payload: AITableGridSetFillHandleStatus): any => {
    const { aiTable } = context;
    const selection = aiTable()!.selection;
    const fillHandleStatus = getFillHandleStatus(context);
    if (!selection()) return;
    if (!selection().ranges) return;
    const selectionRange = selection().ranges![0];
    if (!payload.hoverCell) {
        aiTable().selection().fillHandleStatus = payload;
        return;
    }
};

const SelectionActions = {
    setSelection,
    setActiveCell,
    setFieldRanges,
    clearSelection,
    setFillHandleStatus
};
export default SelectionActions;
