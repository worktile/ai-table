import { AIRecordFieldIdPath, AITableField, AITableFieldOption, AITableSizeMap, FieldValue, FieldOptions } from '@ai-table/utils';
import { AITable, getFieldOptionByField } from '../core';

export function getColumnIndicesSizeMap(aiTable: AITable, fields: AITableField[]) {
    const fieldSizeMap = aiTable.gridData().fieldsSizeMap;
    const columnIndicesSizeMap: AITableSizeMap = {};
    fields?.forEach((field, index) => {
        columnIndicesSizeMap[index] = fieldSizeMap[field._id] ?? (getFieldOptionByField(aiTable, field) as AITableFieldOption).width;
    });
    return columnIndicesSizeMap;
}

/**
 * 获取单元格位置
 * 根据单元格是否是第一列/最后一列确定单元格所在的位置
 */
export function getCellHorizontalPosition(options: { columnWidth: number; columnIndex: number; columnCount: number }) {
    const { columnWidth } = options;
    return { width: columnWidth, offset: 0 };
}

export function transformToCellText<T = any>(cellValue: FieldValue, options: FieldOptions): T | null {
    const { aiTable, field } = options;
    const fieldRenderers = aiTable?.context?.aiFieldConfig()?.fieldRenderers;
    if (!fieldRenderers || !field) {
        return cellValue;
    }

    const toText = fieldRenderers[field.type]?.toText;
    if (!toText) {
        return cellValue;
    }

    const cellText = toText(field, cellValue);
    if (cellText == null) {
        return cellValue;
    }

    return cellText;
}

/**
 * `\u4e00`: https://www.compart.com/en/unicode/U+4E00
 * `\u9fa5`: https://www.compart.com/en/unicode/U+9FA5
 */
const UNIFIED_IDEOGRAPHS_REGEX = /^[\u4e00-\u9fa5]+$/;

const SET_OF_LETTERS_REGEX = /^[a-zA-Z\/ ]+$/;

export function getAvatarShortName(name: string | null | undefined): string {
    if (!name) {
        return '';
    }

    name = name.trim();

    if (UNIFIED_IDEOGRAPHS_REGEX.test(name) && name.length > 2) {
        return name.slice(name.length - 2);
    }

    if (SET_OF_LETTERS_REGEX.test(name) && name.indexOf(' ') > 0) {
        const words: string[] = name.split(' ');
        return (words[0].slice(0, 1) + words[1].slice(0, 1)).toUpperCase();
    }

    return name.length > 2 ? name.slice(0, 2).toUpperCase() : name.toUpperCase();
}

export function getAvatarBgColor(name: string) {
    if (!name) {
        return;
    }
    const colors = ['#56abfb', '#5dcfff', '#84e17e', '#73d897', '#ff9f73', '#fa8888', '#fb7fb7', '#9a7ef4', '#868af6'];
    const nameArray: string[] = name.split('');
    const code: number =
        name && name.length > 0
            ? nameArray.reduce(
                  function (result, item) {
                      result.value += item.charCodeAt(0);
                      return result;
                  },
                  { value: 0 }
              ).value
            : 0;
    return colors[code % 9];
}

export function expandCell(aiTable: AITable, path: AIRecordFieldIdPath) {
    const [recordId, fieldId] = path;
    aiTable.selection.set({
        ...aiTable.selection(),
        activeCell: [recordId, fieldId],
        selectedCells: new Set([`${recordId}:${fieldId}`]),
        expandCell: [recordId, fieldId]
    });
}

export function setExpandCellInfo(aiTable: AITable, expandCellInfo?: { width?: number; height?: number }) {
    aiTable.selection.set({
        ...aiTable.selection(),
        expandCellInfo: expandCellInfo
    });
}
