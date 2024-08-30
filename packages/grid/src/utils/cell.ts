import { computed, Signal } from '@angular/core';
import { AI_TABLE_DEFAULT_COLUMN_WIDTH } from '../constants';
import { AITableField, AITableFields, AITableRecord, AITableRecords } from '../core';
import { AITableSizeMap } from '../types';

export function getRecordOrField(value: Signal<AITableRecords | AITableFields>, _id: string): Signal<AITableField | AITableRecord> {
    return computed(() => {
        return value().find((item) => item._id === _id)!;
    });
}

export function getColumnIndicesMap(fields: AITableField[]) {
    const columnIndicesMap: AITableSizeMap = {};
    fields?.forEach((field, index) => {
        columnIndicesMap[index] = field.width ?? AI_TABLE_DEFAULT_COLUMN_WIDTH;
    });
    return columnIndicesMap;
}

/**
 * 根据单元格是否是第一列/最后一列确定单元格所在的位置
 */
export const getCellHorizontalPosition = (options: { columnWidth: number; columnIndex: number; columnCount: number }) => {
    const { columnWidth } = options;
    return { width: columnWidth, offset: 0 };
};
