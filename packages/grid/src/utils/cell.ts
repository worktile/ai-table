import { computed, Signal } from '@angular/core';
import {
    AITable,
    AITableField,
    AITableFieldOption,
    AITableFields,
    AITableRecord,
    AITableRecords,
    FieldValue,
    getFieldOptionByField
} from '../core';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP } from '../services';
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
export function getCellHorizontalPosition(options: { columnWidth: number; columnIndex: number; columnCount: number }) {
    const { columnWidth } = options;
    return { width: columnWidth, offset: 0 };
}

export function transformCellValue<T = any>(aiTable: AITable, field: AITableField, cellValue: FieldValue): T {
    const fieldService = AI_TABLE_GRID_FIELD_SERVICE_MAP.get(aiTable);

    if (!fieldService) {
        return cellValue;
    }

    const fieldRenderers = fieldService.aiFieldConfig?.fieldRenderers;
    if (!fieldRenderers) {
        return cellValue;
    }

    const cellTransform = fieldRenderers[field.type]?.transform;
    if (!cellTransform) {
        return cellValue;
    }

    const cellText = cellTransform(field, cellValue);

    if (cellText == null) {
        return cellValue;
    }

    return cellText;
}
