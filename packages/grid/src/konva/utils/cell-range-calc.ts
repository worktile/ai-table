import { AITableGridCell } from '@ai-table/grid';
import { AITableGridContext } from './../interface/view';

export const isCellVisible = (context: AITableGridContext, cell: AITableGridCell) => {
    return true;
};

export const getSelection = (context: AITableGridContext) => {
    const { aiTable } = context;
    const selection = aiTable() && aiTable().selection();

    // 活动单元格是否移出
    if (selection?.activeCell && !isCellVisible(context, selection.activeCell!)) {
        return null;
    }
    // 选择区域的起始点和结束点已被移除
    if (selection?.ranges) {
        const { start, end } = selection.ranges[0]!;
        if (!isCellVisible(context, start) || !isCellVisible(context, end)) {
            return null;
        }
    }
    return selection;
};

export const getSelectRanges = (context: AITableGridContext) => {
    const selection = getSelection(context);
    if (!selection || !selection.ranges) {
        return [];
    }
    return selection.ranges;
};

export const getSelectionRecordRanges = (context: AITableGridContext) => {
    const selection = getSelection(context);
    return selection ? selection.recordRanges : undefined;
};

/**
 * 获取选区中的 field
 * @param context
 * @returns
 */
export const getSelectedField = (context: AITableGridContext) => {
    const { fields } = context;
    const selection = getSelection(context);
    if (!selection || !selection.activeCell) {
        return;
    }
    const fieldId = selection.activeCell.fieldId;
    return fields().find((field) => field._id === fieldId);
};

/**
 * 获取选区中的 record
 * @param context
 * @returns
 */
export const getSelectedRecord = (context: AITableGridContext, state: any) => {
    const { records } = context;
    const selection = getSelection(state);
    if (!selection || !selection.activeCell) {
        return;
    }
    const recordId = selection.activeCell.recordId;
    return records().find((record) => record._id === recordId);
};

/**
 * 获取选区中的填充状态
 * @param context
 * @returns
 */
export const getFillHandleStatus = (context: AITableGridContext) => {
    const selection = getSelection(context);
    return selection?.fillHandleStatus;
};

/**
 * 获取选区中的 field 范围
 * @param context
 * @returns
 */
export const getFieldRanges = (context: AITableGridContext) => {
    return getSelection(context)?.fieldRanges;
};
