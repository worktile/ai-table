import { AITable, AITableField, AITableFieldType, AITableQueries, UpdateFieldValueOptions } from '../core';
import { ViewOperationMap } from './field/model';
import { transformCellValue } from './cell';
import { ClipboardData } from '../types';

export const isClipboardWriteSupported = () => {
    return 'clipboard' in navigator && 'write' in navigator.clipboard;
};

export const isClipboardWriteTextSupported = () => {
    return 'clipboard' in navigator && 'writeText' in navigator.clipboard;
};

export const isClipboardReadSupported = () => {
    return 'clipboard' in navigator && 'read' in navigator.clipboard;
};

export const writeToClipboard = async (data: ClipboardData) => {
    const { text, html } = data;
    if (isClipboardWriteSupported()) {
        const clipboardItem = new ClipboardItem({
            'text/plain': new Blob([text!], { type: 'text/plain' }),
            'text/html': new Blob([html!], { type: 'text/html' })
        });
        await navigator.clipboard.write([clipboardItem]);
    } else if (isClipboardWriteTextSupported()) {
        await navigator.clipboard.writeText(text!);
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text!;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
};

export const readFromClipboard = async () => {
    const clipboardText = await navigator.clipboard.readText();
    return clipboardText;
};

export const buildClipboardData = (aiTable: AITable): ClipboardData | null => {
    const copiedCells = Array.from(aiTable.selection().selectedCells);
    const contentsByRecordId = new Map<string, ClipboardData[]>();
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
        contentsByRecordId.set(recordId, [...(contentsByRecordId.get(recordId) || []), cellContent]);
    });

    const rows = Array.from(contentsByRecordId.values());
    const formatClipboardData: ClipboardData = {
        text: rows.map((row) => row.map((column) => column.text).join('\t')).join('\r\n'),
        html: `<table>${rows.map((row) => `<tr>${row.map((column) => `<td>${column.html}</td>`).join('')}</tr>`).join('')}</table>`
    };

    return formatClipboardData;
};

export const writeToAITable = async (aiTable: AITable, updateValueFn: (data: UpdateFieldValueOptions) => void) => {
    const selectedCells = Array.from(aiTable.selection().selectedCells);
    if (!selectedCells.length) {
        return;
    }

    const clipboardText = await readFromClipboard();
    if (!clipboardText) {
        return;
    }
    const pasteData = clipboardText
        .split('\n')
        .map((row) => row.split('\t'))
        .filter((row) => row.length > 0 && row.some((cell) => cell.trim().length > 0));

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
                    value: handlePasteData(value.trim(), targetField),
                    path: [targetRecord._id, targetField._id]
                });
            }
        });
    });
};

export const handlePasteData = (text: string, field: AITableField) => {
    // TODO 处理不同 field 类型，处理粘贴数据
    return text;
};
