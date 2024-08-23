import { AIGrid, AITableGridCell, AITableGridFieldRanges, AITableGridFillHandleStatus, AITableGridRange } from '@ai-table/grid';
import { Range } from '../core/range';
import { getFillHandleStatus } from '../utils/cell-range-calc';
import { AITableGridContext } from './../interface/view';

/**
 * set the selection area
 * @param ranges
 * @returns
 */
export const setSelection = (context: AITableGridContext, ranges: AITableGridRange | AITableGridRange[]) => {
    const { aiTable } = context;
    const selection = aiTable!.selection;
    const payload = Array.isArray(ranges) ? ranges : [ranges];
    const range = payload[0]!;

    if (!selection() || !selection().ranges || !selection().activeCell) {
        aiTable.selection.set({
            ...aiTable.selection(),
            activeCell: range.start,
            ranges: payload
        });
        return;
    }

    aiTable.selection.set({
        ...aiTable.selection(),
        ranges: payload
    });
};

/**
 * 设置选中 cell
 * @param cell
 * @returns
 */
export const setActiveCell = (context: AITableGridContext, cell: AITableGridCell) => {
    const { aiTable } = context;

    aiTable.selection().activeCell = cell;
    // 当激活单元格时，选择区域等于活动单元格本身的向量
    aiTable.selection.set({
        ...aiTable.selection(),
        activeCell: cell
    });
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
    aiTable.selection.set({
        ...aiTable.selection(),
        fieldRanges: payload
    });
};

/**
 * clear the data in selection area
 *
 * @returns
 */
export const clearSelection = (context: AITableGridContext) => {
    const { aiTable } = context;
    aiTable.selection.set({
        ...aiTable.selection(),
        activeCell: undefined,
        ranges: [],
        fieldRanges: [],
        fillHandleStatus: undefined,
        recordRanges: []
    });
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
    const selection = AIGrid.getSelection(context);
    const fillHandleStatus = getFillHandleStatus(context);
    if (!selection) return;
    if (!selection.ranges) return;
    const selectionRange = selection.ranges![0];
    if (!payload.hoverCell) {
        aiTable.selection.set({
            ...aiTable.selection(),
            fillHandleStatus: payload
        });
        return;
    }

    // 点击填充后，鼠标可以在任何地方拖动，悬停在任何单元格上。
    // 根据 "悬停单元格" 计算填充方向，然后设置选择区域。
    const direction = Range.bindModel(selectionRange).getDirection(context, payload.hoverCell);
    if (!direction) return;
    const isFillHandleActive = Boolean(fillHandleStatus && fillHandleStatus.isActive);
    const fillRange = Range.bindModel(selectionRange).getFillRange(context, payload.hoverCell, direction);
    if (!fillRange) return;
    if (!isFillHandleActive) return;

    aiTable.selection.set({
        ...aiTable.selection(),
        fillHandleStatus: {
            ...payload,
            fillRange,
            direction
        }
    });
};

const SelectionActions = {
    setSelection,
    setActiveCell,
    setFieldRanges,
    clearSelection,
    setFillHandleStatus
};
export default SelectionActions;
