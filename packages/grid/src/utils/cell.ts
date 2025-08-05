import { AIRecordFieldIdPath, AITableField, AITableFieldOption, AITableSizeMap, FieldValue, FieldOptions } from '@ai-table/utils';
import { AITable, getFieldOptionByField } from '../core';
import { AITableCellInfo, AITableSelection } from '../types';
import { selectField } from './field';

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

export function clearCoverCell(aiTable: AITable) {
    clearSelection(aiTable);
    closeEditingCell(aiTable);
    closeExpendCell(aiTable);
}

export function clearSelection(aiTable: AITable) {
    aiTable.selection.set({
        selectedRecords: new Set(),
        selectedFields: new Set(),
        selectedCells: new Set(),
        activeCell: null
    });
}

export function clearSelectionRecords(aiTable: AITable) {
    setSelection(aiTable, {
        selectedRecords: new Set()
    });
}

export function clearSelectionFields(aiTable: AITable) {
    setSelection(aiTable, {
        selectedFields: new Set()
    });
}

export function clearSelectedCells(aiTable: AITable) {
    setSelection(aiTable, {
        selectedCells: new Set()
    });
}

export function setExpandCell(aiTable: AITable, expandCellInfo: Partial<AITableCellInfo>) {
    aiTable.expendCell.set({
        ...aiTable.expendCell(),
        ...expandCellInfo
    });
}

export function expandCell(aiTable: AITable, cellPath: AIRecordFieldIdPath) {
    setExpandCell(aiTable, { path: cellPath });
}

export function closeExpendCell(aiTable: AITable) {
    setExpandCell(aiTable, { path: null, width: 0, height: 0 });
}

export function setSelection(aiTable: AITable, selection: Partial<AITableSelection>) {
    aiTable.selection.set({
        ...aiTable.selection(),
        ...selection
    });
}

export function setActiveCell(aiTable: AITable, activeCell: Partial<AITableCellInfo>) {
    aiTable.selection.set({
        ...aiTable.selection(),
        ...activeCell
    });
}

export function setEditingCell(aiTable: AITable, editingCell: Partial<AITableCellInfo>) {
    aiTable.editingCell.set({
        ...aiTable.editingCell(),
        ...editingCell
    });
}

export function closeEditingCell(aiTable: AITable) {
    setEditingCell(aiTable, { path: null });
}

export function selectCells(
    aiTable: AITable,
    startCell: AIRecordFieldIdPath,
    endCell?: AIRecordFieldIdPath,
    activeCell?: AIRecordFieldIdPath | null
) {
    const [startRecordId, startFieldId] = startCell;
    const records = aiTable.context!.linearRows();
    const fields = AITable.getVisibleFields(aiTable);
    const selectedCells = new Set<string>();

    if (!endCell) {
        selectedCells.add(`${startRecordId}:${startFieldId}`);
    } else {
        // 数据的存储设计结构，决定了最后一条就是endCell
        const lastItem = Array.from(aiTable.selection().selectedCells).pop();
        if (endCell.join(':') === lastItem) {
            return;
        }

        const [endRecordId, endFieldId] = endCell;

        const startRowIndex = aiTable.context!.visibleRowsIndexMap().get(startRecordId)!;
        const endRowIndex = aiTable.context!.visibleRowsIndexMap().get(endRecordId)!;
        const startColIndex = aiTable.context!.visibleColumnsIndexMap().get(startFieldId)!;
        const endColIndex = aiTable.context!.visibleColumnsIndexMap().get(endFieldId)!;

        const minRowIndex = Math.min(startRowIndex, endRowIndex);
        const maxRowIndex = Math.max(startRowIndex, endRowIndex);
        const minColIndex = Math.min(startColIndex, endColIndex);
        const maxColIndex = Math.max(startColIndex, endColIndex);

        for (let i = minRowIndex; i <= maxRowIndex; i++) {
            for (let j = minColIndex; j <= maxColIndex; j++) {
                selectedCells.add(`${records[i]._id}:${fields[j]._id}`);
            }
        }
    }

    clearSelection(aiTable);
    setSelection(aiTable, {
        activeCell: activeCell || startCell,
        selectedCells: selectedCells
    });
}

export function updateSelect(event: MouseEvent, aiTable: AITable) {
    const target = event?.target as HTMLElement;
    if (!target) {
        return;
    }
    const cellDom = target.closest('.grid-cell');
    const colDom = target.closest('.grid-field');
    const checkbox = target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox' && target.closest('.grid-checkbox');
    const fieldAction = target.closest('.grid-field-action');
    if (cellDom) {
        const fieldId = cellDom.getAttribute('fieldId');
        const recordId = cellDom.getAttribute('recordId');
        fieldId && recordId && selectCells(aiTable, [recordId, fieldId]);
    }
    if (colDom && !fieldAction) {
        const fieldId = colDom.getAttribute('fieldId');
        fieldId && selectField(aiTable, fieldId);
    }
    if (!cellDom && !colDom && !checkbox) {
        clearSelection(aiTable);
    }
}
