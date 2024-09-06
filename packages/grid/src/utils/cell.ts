import { computed, Signal } from '@angular/core';
import { AITableField, AITableFieldOption, AITableFields, AITableRecord, AITableRecords, getFieldOptionByField } from '../core';
import { AITableCellHeightOptions, AITableSizeMap } from '../types';

export function getRecordOrField(value: Signal<AITableRecords | AITableFields>, _id: string): Signal<AITableField | AITableRecord> {
    return computed(() => {
        return value().find((item) => item._id === _id)!;
    });
}

export function getColumnIndicesMap(fields: AITableField[]) {
    const columnIndicesMap: AITableSizeMap = {};
    fields?.forEach((field, index) => {
        columnIndicesMap[index] = field.width ?? (getFieldOptionByField(field) as AITableFieldOption).width;
    });
    return columnIndicesMap;
}

/**
 * 获取单元格位置
 * 根据单元格是否是第一列/最后一列确定单元格所在的位置
 */
export const getCellHorizontalPosition = (options: { columnWidth: number; columnIndex: number; columnCount: number }) => {
    const { columnWidth } = options;
    return { width: columnWidth, offset: 0 };
};

/**
 * 获取单元格高度
 * @param props
 * @returns
 */
export const getCellHeight = (options: AITableCellHeightOptions) => {
    const { field, rowHeight, activeHeight, isActive = false } = options;
    if (!field || !isActive) return rowHeight;

    return activeHeight || rowHeight;
};
