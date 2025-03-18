import { AITable, AITableFieldType, AITableQueries, UpdateFieldValueOptions } from '../../core';
import { ViewOperationMap } from '../field/model';
import { transformCellValue } from '../cell';
import { ClipboardData } from '../../types';
import { readFromClipboard } from './common';

const aiTableSpecialAttribute = 'ai-table-json-value';

const aiTableAttributePattern = new RegExp(`${aiTableSpecialAttribute}="(.+?)"`, 'm');

const encodeClipboardJsonData = (data: any) => {
    const stringifiedData = JSON.stringify(data);
    return window.btoa(encodeURIComponent(stringifiedData));
};

const decodeClipboardJsonData = (encoded: string) => {
    const decoded = decodeURIComponent(window.atob(encoded));
    return JSON.parse(decoded);
};

function formatClipboardData(data: ClipboardData[][], jsonData: string[][]): ClipboardData {
    const encodeData = encodeClipboardJsonData(jsonData);
    const formatClipboardData = {
        text: data.map((row) => row.map((column) => column.text).join('\t')).join('\r\n'),
        html: `<table ${aiTableSpecialAttribute}="${encodeData}">${data.map((row) => `<tr>${row.map((column) => `<td>${column.html}</td>`).join('')}</tr>`).join('')}</table>`
    };
    return formatClipboardData;
}

export const buildClipboardData = (aiTable: AITable): ClipboardData | null => {
    const copiedCells = Array.from(aiTable.selection().selectedCells);
    const dataByRecordId = new Map<string, ClipboardData[]>();
    const jsonDataByRecordId = new Map<string, string[]>();
    if (!copiedCells.length) {
        return null;
    }

    copiedCells.forEach((cellPath: string) => {
        const [recordId, fieldId] = cellPath.split(':');
        const cellValue = AITableQueries.getFieldValue(aiTable, [recordId, fieldId]);
        const field = aiTable.fieldsMap()[fieldId!];
        const transformValue = transformCellValue(aiTable, field, cellValue);
        const references = aiTable.context!.references();
        const cellTexts: string[] = ViewOperationMap[field.type].cellFullText(transformValue, field, references);

        let cellContent = {
            text: cellTexts.join(','),
            html: cellTexts.join(',')
        };
        if (field.type === AITableFieldType.link && cellValue && cellValue.url) {
            cellContent.html = `<a href="${cellValue.url}" target="_blank">${cellValue.text}</a>`;
        }
        dataByRecordId.set(recordId, [...(dataByRecordId.get(recordId) || []), cellContent]);

        const cellJsonData = JSON.stringify({
            fieldId,
            cellValue,
            cellFullText: cellTexts.join(',')
        });
        jsonDataByRecordId.set(recordId, [...(jsonDataByRecordId.get(recordId) || []), cellJsonData]);
    });

    const clipboardData = Array.from(dataByRecordId.values());
    const jsonData = Array.from(jsonDataByRecordId.values());
    return formatClipboardData(clipboardData, jsonData);
};

const readClipboardData = async (): Promise<{ pasteData: string[][]; isJson: boolean }> => {
    const clipboardData = await readFromClipboard();
    let pasteData: string[][];

    if (clipboardData && clipboardData.html) {
        const aiTableAttribute = clipboardData.html.match(aiTableAttributePattern);
        if (aiTableAttribute && aiTableAttribute[1]) {
            pasteData = decodeClipboardJsonData(aiTableAttribute[1]);
            return {
                pasteData,
                isJson: true
            };
        }
    }

    if (clipboardData && clipboardData.text) {
        pasteData = clipboardData.text
            .split('\n')
            .map((row) => row.split('\t'))
            .filter((row) => row.length > 0 && row.some((cell) => cell.trim().length > 0));

        return {
            pasteData,
            isJson: false
        };
    }

    return {
        pasteData: [],
        isJson: false
    };
};

export const writeToAITable = async (aiTable: AITable, updateValueFn: (data: UpdateFieldValueOptions) => void) => {
    const selectedCells = Array.from(aiTable.selection().selectedCells);
    if (!selectedCells.length) {
        return;
    }
    const { pasteData, isJson } = await readClipboardData();
    if (!pasteData.length) {
        return;
    }

    const [firstCell] = selectedCells;
    const [startRecordId, startFieldId] = firstCell.split(':');

    const startRowIndex = aiTable.context!.visibleRowsIndexMap().get(startRecordId) ?? 0;
    const startColIndex = aiTable.context!.visibleColumnsIndexMap().get(startFieldId) ?? 0;
    const visibleFields = AITable.getVisibleFields(aiTable);
    const linearRows = aiTable.context!.linearRows();

    pasteData.forEach((row, i) => {
        row.forEach((value, j) => {
            const targetRowIndex = startRowIndex + i;
            const targetColIndex = startColIndex + j;
            if (targetRowIndex >= linearRows.length || targetColIndex >= visibleFields.length) {
                return;
            }

            const targetRecord = linearRows[targetRowIndex];
            const targetField = visibleFields[targetColIndex];

            // TODO 完善 handlePasteData 逻辑之后，移除这个 if 判断
            if (targetField.type === AITableFieldType.text) {
                updateValueFn({
                    value: handlePasteData(aiTable, value, isJson),
                    path: [targetRecord._id, targetField._id]
                });
            }
        });
    });
};

export const handlePasteData = (aiTable: AITable, value: string, isJson: boolean) => {
    // TODO 处理不同 field 类型、处理边界粘贴
    return isJson ? (JSON.parse(value)?.cellFullText ?? value) : value;
};
