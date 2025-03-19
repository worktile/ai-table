import { AITable, AITableFieldType, AITableQueries } from '../../core';
import { ViewOperationMap } from '../field/model';
import { transformCellValue } from '../cell';
import { AITableCellContent, ClipboardData } from '../../types';

export const aiTableSpecialAttribute = 'ai-table-fragment';

const encodeClipboardJsonData = (data: any) => {
    const stringifiedData = JSON.stringify(data);
    return window.btoa(encodeURIComponent(stringifiedData));
};

function formatClipboardData(data: ClipboardData[][], jsonData: string[][]): ClipboardData {
    const encodeData = encodeClipboardJsonData(jsonData);
    const formatClipboardData: ClipboardData = {
        text: data.map((row) => row.map((column) => column.text).join('\t')).join('\r\n'),
        html: `<table ${aiTableSpecialAttribute}="${encodeData}">${data.map((row) => `<tr>${row.map((column) => `<td>${column.html}</td>`).join('')}</tr>`).join('')}</table>`
    };
    return formatClipboardData;
}

export const buildClipboardData = (aiTable: AITable): ClipboardData | null => {
    const copiedCells = Array.from(aiTable.selection().selectedCells);
    const clipboardContentByRecordId = new Map<string, ClipboardData[]>();
    const aiTableContentByRecordId = new Map<string, string[]>();
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

        let cellClipboardContent = {
            text: cellTexts.join(','),
            html: cellTexts.join(',')
        };
        if (field.type === AITableFieldType.link && cellValue && cellValue.url) {
            cellClipboardContent.html = `<a href="${cellValue.url}" target="_blank">${cellValue.text}</a>`;
        }
        clipboardContentByRecordId.set(recordId, [...(clipboardContentByRecordId.get(recordId) || []), cellClipboardContent]);

        const cellAITableContent: AITableCellContent = {
            field,
            cellValue,
            cellFullText: cellTexts.join(',')
        };
        aiTableContentByRecordId.set(recordId, [...(aiTableContentByRecordId.get(recordId) || []), JSON.stringify(cellAITableContent)]);
    });

    const clipboardData = Array.from(clipboardContentByRecordId.values());
    const aiTableContentData = Array.from(aiTableContentByRecordId.values());
    return formatClipboardData(clipboardData, aiTableContentData);
};
