import { AITable, AITableFieldType, AITableQueries } from '../../core';
import { ViewOperationMap } from '../field/model';
import { transformCellValue } from '../cell';
import { ClipboardData } from '../../types';

export const aiTableSpecialAttribute = 'ai-table-json-value';

const encodeClipboardJsonData = (data: any) => {
    const stringifiedData = JSON.stringify(data);
    return window.btoa(encodeURIComponent(stringifiedData));
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
