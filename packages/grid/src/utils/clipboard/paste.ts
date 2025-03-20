import { AITableContent, AITableReferences } from '../../types';
import { AITable, AITableField, AITableRecord, getFieldValue, UpdateFieldValueOptions } from '../../core';
import { readFromClipboard, aiTableSpecialAttribute } from '../clipboard';
import { FieldModelMap } from '../field/model';

const aiTableAttributePattern = new RegExp(`${aiTableSpecialAttribute}="(.+?)"`, 'm');

const decodeClipboardJsonData = (encoded: string) => {
    const decoded = decodeURIComponent(window.atob(encoded));
    return JSON.parse(decoded);
};

const readClipboardData = async (): Promise<{ clipboardPlainTexts: string[][]; aiTableContent: AITableContent | null }> => {
    const clipboardData = await readFromClipboard();
    let clipboardPlainTexts: string[][] = [];
    let aiTableContent: AITableContent | null = null;

    if (clipboardData && clipboardData.html) {
        const aiTableAttribute = clipboardData.html.match(aiTableAttributePattern);
        if (aiTableAttribute && aiTableAttribute[1]) {
            aiTableContent = decodeClipboardJsonData(aiTableAttribute[1]);
        }
    }

    if (clipboardData && clipboardData.text) {
        clipboardPlainTexts = clipboardData.text
            .split('\n')
            .map((row) => row.split('\t'))
            .filter((row) => row.length > 0 && row.some((cell) => cell.trim().length > 0));
    }

    return {
        clipboardPlainTexts,
        aiTableContent
    };
};

function getPasteValue(
    plainText: string,
    aiTableContent: AITableContent | null,
    record: AITableRecord,
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
    const { clipboardPlainTexts, aiTableContent } = await readClipboardData();
    if (!clipboardPlainTexts.length) {
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

    clipboardPlainTexts.forEach((row, i) => {
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
