import { AITable, AITableFieldType, AITableQueries, AITableRecord, AITableField } from '../../core';
import { FieldModelMap } from '../field/model';
import { transformCellValue } from '../cell';
import { AITableContent, ClipboardContent } from '../../types';

export const aiTableSpecialAttribute = 'ai-table-fragment';

const encodeClipboardJsonData = (data: any) => {
    const stringifiedData = JSON.stringify(data);
    return window.btoa(encodeURIComponent(stringifiedData));
};

function formatClipboardData(clipboardContent: ClipboardContent[][], aiTableContent: AITableContent): ClipboardContent {
    const encodeData = encodeClipboardJsonData(aiTableContent);
    const formatedContent: ClipboardContent = {
        text: clipboardContent.map((row) => row.map((column) => column.text).join('\t')).join('\r\n'),
        html: `<table ${aiTableSpecialAttribute}="${encodeData}">${clipboardContent.map((row) => `<tr>${row.map((column) => `<td>${column.html}</td>`).join('')}</tr>`).join('')}</table>`
    };
    return formatedContent;
}

export const buildClipboardData = (aiTable: AITable): ClipboardContent | null => {
    const copiedCells = Array.from(aiTable.selection().selectedCells);
    if (!copiedCells.length) {
        return null;
    }

    const clipboardContentMap = new Map<string, ClipboardContent[]>();
    const copiedRecordsMap = new Map<string, AITableRecord>();
    const copidFieldsMap = new Map<string, AITableField>();

    copiedCells.forEach((cellPath: string) => {
        const [recordId, fieldId] = cellPath.split(':');
        const cellValue = AITableQueries.getFieldValue(aiTable, [recordId, fieldId]);
        const record: AITableRecord = aiTable.recordsMap()[recordId];
        const field: AITableField = aiTable.fieldsMap()[fieldId!];
        const transformValue = transformCellValue(aiTable, field, cellValue);
        const references = aiTable.context!.references();
        const cellTexts: string[] = FieldModelMap[field.type].cellFullText(transformValue, field, references);

        let cellContent = {
            text: cellTexts.join(','),
            html: cellTexts.join(',')
        };
        if (field.type === AITableFieldType.link && cellValue && cellValue.url) {
            cellContent.html = `<a href="${cellValue.url}" target="_blank">${cellValue.text}</a>`;
        }
        clipboardContentMap.set(recordId, [...(clipboardContentMap.get(recordId) || []), cellContent]);

        if (recordId && !copiedRecordsMap.has(recordId)) {
            copiedRecordsMap.set(recordId, record);
        }
        if (fieldId && !copidFieldsMap.has(fieldId)) {
            copidFieldsMap.set(fieldId, field);
        }
    });

    const clipboardContent = Array.from(clipboardContentMap.values());
    const aiTableContent: AITableContent = {
        records: Array.from(copiedRecordsMap.values()),
        fields: Array.from(copidFieldsMap.values())
    };
    return formatClipboardData(clipboardContent, aiTableContent);
};
