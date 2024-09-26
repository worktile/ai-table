import { AITableField, AITableFieldOption, getFieldOptionByField } from '../core';
import { AITableSizeMap } from '../types';

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
