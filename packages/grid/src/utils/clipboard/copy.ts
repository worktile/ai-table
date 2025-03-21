import { AITable, AITableFieldType, AITableRecord, getFieldValue, getSystemFieldValue, isSystemField, SystemFieldTypes } from '../../core';
import { FieldModelMap } from '../field/model';
import { transformCellValue } from '../cell';
import { AITableContent, ClipboardContent } from '../../types';

export const aiTableFragmentAttribute = 'ai-table-fragment';

export const buildClipboardData = (aiTable: AITable): ClipboardContent | null => {
    const copiedCells = Array.from(aiTable.selection().selectedCells);
    if (!copiedCells.length) {
        return null;
    }

    let copiedFieldIds = new Set<string>();
    let copiedRecordIds = new Set<string>();
    copiedCells.forEach((cellPath: string) => {
        const [recordId, fieldId] = cellPath.split(':');
        copiedFieldIds.add(fieldId);
        copiedRecordIds.add(recordId);
    });

    const fieldIds = Array.from(copiedFieldIds);
    const recordIds = Array.from(copiedRecordIds);
    const aiTableContent = buildAITableContent(aiTable, fieldIds, recordIds);
    const clipboardContent = buildClipboardContent(aiTable, fieldIds, recordIds);

    return mergeClipboardContent(clipboardContent, aiTableContent);
};

const encodeAITableContent = (aiTableContent: AITableContent) => {
    const stringifiedData = JSON.stringify(aiTableContent);
    return window.btoa(encodeURIComponent(stringifiedData));
};

function mergeClipboardContent(clipboardContent: ClipboardContent[][], aiTableContent: AITableContent): ClipboardContent {
    const encodedAITableContent = encodeAITableContent(aiTableContent);
    const formattedContent: ClipboardContent = {
        text: clipboardContent.map((row) => row.map((column) => column.text).join('\t')).join('\r\n'),
        html: `<table ${aiTableFragmentAttribute}="${encodedAITableContent}">${clipboardContent.map((row) => `<tr>${row.map((column) => `<td>${column.html}</td>`).join('')}</tr>`).join('')}</table>`
    };
    return formattedContent;
}

function buildAITableContent(aiTable: AITable, fieldIds: string[], recordIds: string[]): AITableContent {
    const fields = fieldIds.map((fieldId) => {
        return aiTable.fieldsMap()[fieldId];
    });

    const records = recordIds.map((recordId) => {
        const record = aiTable.recordsMap()[recordId];
        let newRecord: Partial<AITableRecord> = {
            _id: record._id,
            values: {}
        };
        fieldIds.forEach((fieldId) => {
            const field = aiTable.fieldsMap()[fieldId];
            if (isSystemField(field)) {
                const fieldType: SystemFieldTypes = field.type as SystemFieldTypes;
                newRecord = {
                    ...newRecord,
                    [fieldType]: getSystemFieldValue(record, fieldType)
                };
            } else {
                newRecord.values = {
                    ...newRecord.values,
                    [fieldId]: getFieldValue(record, field)
                };
            }
        });
        return newRecord;
    });

    return {
        fields,
        records
    };
}

function buildClipboardContent(aiTable: AITable, fieldIds: string[], recordIds: string[]): ClipboardContent[][] {
    const clipboardContent: ClipboardContent[][] = [];
    const references = aiTable.context!.references();
    recordIds.forEach((recordId) => {
        const record = aiTable.recordsMap()[recordId];
        const row: { text: string; html: string }[] = [];
        fieldIds.forEach((fieldId) => {
            const field = aiTable.fieldsMap()[fieldId];
            const cellValue = getFieldValue(record, field);
            const transformValue = transformCellValue(aiTable, field, cellValue);
            const cellTexts: string[] = FieldModelMap[field.type].cellFullText(transformValue, field, references);
            let cellContent = {
                text: cellTexts.join(','),
                html: cellTexts.join(',')
            };
            if (field.type === AITableFieldType.link && cellValue && cellValue.url) {
                cellContent.html = `<a href="${cellValue.url}" target="_blank">${cellValue.text}</a>`;
            }
            row.push(cellContent);
        });
        clipboardContent.push(row);
    });
    return clipboardContent;
}
