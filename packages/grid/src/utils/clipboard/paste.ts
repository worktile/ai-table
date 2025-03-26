import { AITableContent, AITableReferences } from '../../types';
import {
    AITable,
    AITableField,
    AITableFieldType,
    AITableRecord,
    AITableSelectOption,
    FieldValue,
    getFieldValue,
    idCreator,
    SelectSettings,
    UpdateFieldValueOptions
} from '../../core';
import { readFromClipboard, aiTableFragmentAttribute, extractText } from '../clipboard';
import { FieldModelMap } from '../field/model';
import { parseSelectFieldValue } from '../field/model/select';
import { AIViewTable } from '@ai-table/state';
import { Actions } from '@ai-table/state';

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
    const cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const contents: string[][] = [];

    try {
        const tableMatch = clipboardHtml.match(tablePattern);
        const tableContent = tableMatch ? tableMatch[1] : clipboardHtml;
        const rows = tableContent.match(trPattern) || [];

        rows.forEach((row) => {
            const rowContent: string[] = [];
            const cells = row.match(cellPattern) || [];

            cells.forEach((cell) => {
                const content = cell.replace(/<td>|<\/td>/g, '').trim();
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

function appendSelectOptions(aiTable: AITable, field: AITableField, newOptions: Partial<AITableSelectOption>[] = []): string[] {
    newOptions = newOptions.map((option) => {
        return {
            ...option,
            _id: idCreator()
        };
    });
    const newField = {
        ...field,
        settings: {
            ...field.settings,
            options: [...((field.settings as SelectSettings)?.options || []), ...newOptions]
        }
    };
    Actions.setField(aiTable as AIViewTable, newField, [newField._id]);
    const newOptionIds = newOptions.map((option) => option._id).filter((id) => !!id) as string[];
    return newOptionIds;
}

function getPasteValue(
    aiTable: AITable,
    plainText: string,
    aiTableContent: AITableContent | null,
    recordIndex: number,
    fieldIndex: number,
    targetField: AITableField,
    references: AITableReferences
): FieldValue | null {
    let field: AITableField | null = null;
    let record: Partial<AITableRecord> | null = null;

    if (aiTableContent) {
        const { fields, records } = aiTableContent;
        field = fields[fieldIndex];
        record = records[recordIndex];
    }

    if (targetField.type === AITableFieldType.attachment || (field && field.type === AITableFieldType.attachment)) {
        return null;
    }
    if (targetField.type !== AITableFieldType.link) {
        plainText = extractText(plainText);
    }

    let originData = field && record ? { field, cellValue: getFieldValue(record, field) } : null;
    if (targetField.type === AITableFieldType.select) {
        let { existOptionIds, newOptions } = parseSelectFieldValue(plainText, targetField, originData);
        const newOptionIds = appendSelectOptions(aiTable, targetField, newOptions);
        const selectFieldValue = [...existOptionIds, ...newOptionIds];
        return selectFieldValue;
    }

    return FieldModelMap[targetField.type].toFieldValue(plainText, targetField, originData, references);
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

    clipboardContent.forEach((row, i) => {
        row.forEach((plainText, j) => {
            const targetRowIndex = startRowIndex + i;
            const targetColIndex = startColIndex + j;
            if (targetRowIndex >= linearRows.length || targetColIndex >= visibleFields.length) {
                return;
            }

            const targetRecord = linearRows[targetRowIndex];
            const targetField = visibleFields[targetColIndex];
            const recordIndex = i;
            const fieldIndex = j;
            const value = getPasteValue(aiTable, plainText, aiTableContent, recordIndex, fieldIndex, targetField, references);

            if (value !== null) {
                updateValueFn({
                    value,
                    path: [targetRecord._id, targetField._id]
                });
            }
        });
    });
};
