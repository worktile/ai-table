import { AITableContent } from '../../types';
import { AITable, createDefaultField, createDefaultFieldName, getFieldOptions, getFieldValue, idCreator } from '../../core';
import { readFromClipboard, aiTableFragmentAttribute, extractText } from '../clipboard';
import { processPastedValueForSelect } from '../field/model/select';
import { FieldModelMap } from '../field';
import {
    AITableField,
    AITableFieldType,
    FieldValue,
    SelectSettings,
    AITableRecord,
    UpdateFieldValueOptions,
    AddRecordOptions,
    AddFieldOptions,
    AITableReferences
} from '@ai-table/utils';

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

function processTableCell(cellHtml: string): string {
    const linkPattern = /<a[^>]*?href=["']([^"']+)["'][^>]*?>([^<]*?)<\/a>/i;
    const match = cellHtml.match(linkPattern);
    const link = match ? { href: match[1], text: match[2] } : null;
    const content = link ? cellHtml.replace(linkPattern, `[LINK:${link.text}](${link.href})`) : cellHtml;

    const cleanContent = content
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return link ? cleanContent.replace(`[LINK:${link.text}](${link.href})`, `<a href="${link.href}">${link.text}</a>`) : cleanContent;
}

function extractContentFromClipboardHtml(clipboardHtml: string): string[][] {
    const tablePattern = /<table[^>]*>([\s\S]*?)<\/table>/i;
    const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const tdPattern = /<td[^>]*?>([\s\S]*?)<\/td>/gi;

    try {
        const tableMatch = clipboardHtml.match(tablePattern);
        const tableContent = tableMatch ? tableMatch[1] : clipboardHtml;
        const rows = tableContent.match(trPattern) || [];

        return rows
            .map((row) => {
                const contents: string[] = [];
                let tdMatch;

                while ((tdMatch = tdPattern.exec(row)) !== null) {
                    contents.push(processTableCell(tdMatch[1]));
                }

                return contents;
            })
            .filter((row) => row.length > 0);
    } catch (error) {
        console.warn('Failed to extract content from HTML:', error);
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
    recordIndex: number,
    fieldIndex: number,
    targetField: AITableField,
    references: AITableReferences
): {
    value: FieldValue | null;
    newField: AITableField | null;
} {
    let field: AITableField | null = null;
    let record: Partial<AITableRecord> | null = null;

    if (aiTableContent) {
        const { fields, records } = aiTableContent;
        field = fields[fieldIndex];
        record = records[recordIndex];
    }

    if (targetField.type !== AITableFieldType.link) {
        plainText = extractText(plainText);
    }

    let originData = field && record ? { field, cellValue: getFieldValue(record, field) } : null;
    if (targetField.type === AITableFieldType.select) {
        let { existOptionIds, newOptions } = processPastedValueForSelect(plainText, targetField, originData);
        let newField: AITableField | null = null;
        let newOptionIds: string[] = [];

        if (newOptions.length) {
            newField = {
                ...targetField,
                settings: {
                    ...targetField.settings,
                    options: [...((targetField.settings as SelectSettings)?.options || []), ...newOptions]
                }
            };
            newOptionIds = newOptions.map((option) => option._id).filter((id) => !!id) as string[];
        }

        const selectFieldValue = newOptionIds?.length ? [...existOptionIds, ...newOptionIds] : existOptionIds;
        return {
            value: selectFieldValue,
            newField
        };
    }

    return { value: FieldModelMap[targetField.type].toFieldValue(plainText, targetField, originData, references), newField: null };
}

export interface AITableActions {
    updateFieldValue: (data: UpdateFieldValueOptions) => void;
    setField: (field: AITableField) => void;
    addRecord: (data: AddRecordOptions) => void;
    addField: (data: AddFieldOptions) => void;
}

function appendField(aiTable: AITable, originField: AITableField | null, actions: AITableActions) {
    let defaultFieldValue: Partial<AITableField>;

    if (originField) {
        const fieldOptions = getFieldOptions(aiTable);
        defaultFieldValue = {
            ...originField,
            name: createDefaultFieldName(aiTable, fieldOptions.find((item) => item.type === originField.type)!),
            _id: idCreator()
        };
    } else {
        defaultFieldValue = createDefaultField(aiTable, AITableFieldType.text);
    }

    actions.addField({
        defaultValue: defaultFieldValue
    });
}

export const writeToAITable = async (aiTable: AITable, actions: AITableActions) => {
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
    const lastRowIndex = aiTable.context!.linearRows().length - 1;
    const appendRowCount = clipboardContent.length - (lastRowIndex - startRowIndex);
    actions.addRecord({ count: appendRowCount });

    const startColIndex = aiTable.context!.visibleColumnsIndexMap().get(startFieldId) ?? 0;
    const lastColIndex = aiTable.context!.visibleColumnsIndexMap().size - 1;
    const copiedFieldLength = clipboardContent[0].length;
    const appendColCount = copiedFieldLength - (lastColIndex - startColIndex) - 1;
    const appendOffeset = copiedFieldLength - appendColCount;

    for (let i = 0; i < appendColCount; i++) {
        const originField = aiTableContent?.fields[appendOffeset + i] || null;
        appendField(aiTable, originField, actions);
    }

    const linearRows = aiTable.context!.linearRows();
    const references = aiTable.context!.references();
    let isPasteSuccess = false;
    let visibleFields = AITable.getVisibleFields(aiTable);

    clipboardContent.forEach((row, i) => {
        const targetRowIndex = startRowIndex + i;
        row.forEach((plainText, j) => {
            const targetColIndex = startColIndex + j;
            const targetRecord = linearRows[targetRowIndex];
            const targetField = visibleFields[targetColIndex];
            const recordIndex = i;
            const fieldIndex = j;
            const { value, newField } = getPasteValue(plainText, aiTableContent, recordIndex, fieldIndex, targetField, references);

            if (newField) {
                actions.setField(newField);
            }

            if (value !== null) {
                try {
                    actions.updateFieldValue({
                        value,
                        path: [targetRecord._id, targetField._id]
                    });
                    isPasteSuccess = true;
                } catch (error) {
                    console.error('Failed to paste value:', error);
                }
            }
        });
    });

    return isPasteSuccess;
};
