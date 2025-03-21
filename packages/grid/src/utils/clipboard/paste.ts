import { AITableContent, AITableReferences } from '../../types';
import { AITable, AITableField, AITableRecord, getFieldValue, UpdateFieldValueOptions } from '../../core';
import { readFromClipboard, aiTableFragmentAttribute } from '../clipboard';
import { FieldModelMap } from '../field/model';

const aiTableAttributePattern = new RegExp(`${aiTableFragmentAttribute}="(.+?)"`, 'm');

const decodeClipboardJsonData = (encoded: string) => {
    const decoded = decodeURIComponent(window.atob(encoded));
    return JSON.parse(decoded);
};

function extractContentFromClipboardText(clipboardText: string): string[][] {
    const contents = clipboardText
        .split('\n')
        .map((row) => row.split('\t'))
        .filter((row) => row.length > 0 && row.some((cell) => cell.trim().length > 0));

    return contents;
}

function extractContentFromClipboardHtml(clipboardHtml: string): string[][] {
    const tablePattern = /<table[^>]*>([\s\S]*?)<\/table>/i;
    const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellPattern = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    const contents: string[][] = [];

    try {
        const tableMatch = clipboardHtml.match(tablePattern);
        const tableContent = tableMatch ? tableMatch[1] : clipboardHtml;
        const rows = tableContent.match(trPattern) || [];

        rows.forEach((row) => {
            const rowContent: string[] = [];
            const cells = row.match(cellPattern) || [];

            cells.forEach((cell) => {
                let content = cell
                    .replace(/<[^>]+>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .trim();
                rowContent.push(content);
            });

            contents.push(rowContent);
        });

        return contents;
    } catch (error) {
        return [];
    }
}

function extractAITableContentFromClipboardHtml(clipboardHtml: string): AITableContent | null {
    const aiTableFragment = clipboardHtml.match(aiTableAttributePattern);
    if (aiTableFragment && !!aiTableFragment.length) {
        return decodeClipboardJsonData(aiTableFragment[1]);
    }
    return null;
}

const readClipboardData = async (): Promise<{ clipboardContent: string[][]; aiTableContent: AITableContent | null }> => {
    const clipboardData = await readFromClipboard();
    let clipboardContent: string[][] = [];
    let aiTableContent: AITableContent | null = null;

    if (clipboardData) {
        const clipboardHtml = clipboardData.html;
        const clipboardText = clipboardData.text;

        if (clipboardHtml) {
            aiTableContent = extractAITableContentFromClipboardHtml(clipboardHtml);
            clipboardContent = extractContentFromClipboardHtml(clipboardHtml);
        }

        if (!clipboardContent.length && clipboardText) {
            clipboardContent = extractContentFromClipboardText(clipboardText);
        }
    }

    return {
        clipboardContent,
        aiTableContent
    };
};

function getPasteValue(
    plainText: string,
    aiTableContent: AITableContent | null,
    record: Partial<AITableRecord>,
    field: AITableField,
    targetField: AITableField,
    references: AITableReferences
) {
    if (!!aiTableContent) {
        const originData = {
            field,
            cellValue: getFieldValue(record, field)
        };
        return FieldModelMap[targetField.type].toFieldValue(plainText, targetField, originData, references);
    } else {
        return FieldModelMap[targetField.type].toFieldValue(plainText, targetField, null, references);
    }
}

export const writeToAITable = async (aiTable: AITable, updateValueFn: (data: UpdateFieldValueOptions) => void) => {
    const selectedCells = Array.from(aiTable.selection().selectedCells);
    if (!selectedCells.length) {
        return;
    }
    const { clipboardContent, aiTableContent } = await readClipboardData();
    if (!clipboardContent.length) {
        return;
    }

    const [firstCell] = selectedCells;
    const [startRecordId, startFieldId] = firstCell.split(':');
    const startRowIndex = aiTable.context!.visibleRowsIndexMap().get(startRecordId) ?? 0;
    const startColIndex = aiTable.context!.visibleColumnsIndexMap().get(startFieldId) ?? 0;
    const visibleFields = AITable.getVisibleFields(aiTable);
    const linearRows = aiTable.context!.linearRows();
    const references = aiTable.context!.references();

    const copiedFields = aiTableContent?.fields || [];
    const copiedRecords = aiTableContent?.records || [];

    clipboardContent.forEach((row, i) => {
        row.forEach((plainText, j) => {
            const targetRowIndex = startRowIndex + i;
            const targetColIndex = startColIndex + j;
            if (targetRowIndex >= linearRows.length || targetColIndex >= visibleFields.length) {
                return;
            }

            const targetRecord = linearRows[targetRowIndex];
            const targetField = visibleFields[targetColIndex];
            const value = getPasteValue(plainText, aiTableContent, copiedRecords[i], copiedFields[j], targetField, references);

            if (value !== null) {
                updateValueFn({
                    value,
                    path: [targetRecord._id, targetField._id]
                });
            }
        });
    });
};
