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

export const writeToAITable = async (
    aiTable: AITable,
    actions: AITableActions
): Promise<{ isPasteSuccess: boolean; isPasteOverMaxRecords: boolean; isPasteOverMaxFields: boolean }> => {
    const selectedCells = Array.from(aiTable.selection().selectedCells);
    const result = {
        isPasteSuccess: false,
        isPasteOverMaxRecords: false,
        isPasteOverMaxFields: false
    };
    if (!selectedCells.length) {
        return result;
    }
    const { clipboardContent, aiTableContent } = await readClipboardData();
    if (!clipboardContent.length) {
        return result;
    }
    const clipboardCellsCount = clipboardContent.length * clipboardContent[0].length;
    const [firstCell] = selectedCells;
    const [startRecordId, startFieldId] = firstCell.split(':');

    const maxFields = aiTable.context!.maxFields();
    const maxRecords = aiTable.context!.maxRecords();
    const maxPasteCellsCount = aiTable.context!.maxPasteCellsCount();

    const startRowIndex = aiTable.context!.visibleRowsIndexMap().get(startRecordId) ?? 0;
    const lastRowIndex = aiTable.context!.linearRows().length - 1;
    let appendRowCount = clipboardContent.length - (lastRowIndex - startRowIndex);
    if (maxRecords && lastRowIndex + appendRowCount > maxRecords) {
        appendRowCount = maxRecords - lastRowIndex;
        result.isPasteOverMaxRecords = true;
    }
    if (maxPasteCellsCount && clipboardCellsCount > maxPasteCellsCount) {
        const pasteMaxRecordCount = Math.ceil(maxPasteCellsCount / clipboardContent[0].length);
        appendRowCount = pasteMaxRecordCount - (lastRowIndex - startRowIndex);
    }
    actions.addRecord({ count: appendRowCount });

    const startColIndex = aiTable.context!.visibleColumnsIndexMap().get(startFieldId) ?? 0;
    const lastColIndex = aiTable.context!.visibleColumnsIndexMap().size - 1;
    const copiedFieldLength = clipboardContent[0].length;
    let appendColCount = copiedFieldLength - (lastColIndex - startColIndex) - 1;
    let appendOffset = copiedFieldLength - appendColCount;
    if (maxPasteCellsCount && clipboardCellsCount > maxPasteCellsCount) {
        appendColCount = copiedFieldLength > maxPasteCellsCount ? maxPasteCellsCount - 1 : appendColCount;
        appendOffset = maxPasteCellsCount - appendColCount;
    }

    for (let i = 0; i < appendColCount; i++) {
        if (maxFields && lastColIndex + i + 1 < maxFields) {
            const originField = aiTableContent?.fields[appendOffset + i] || null;
            appendField(aiTable, originField, actions);
        } else {
            result.isPasteOverMaxFields = true;
        }
    }

    const linearRows = aiTable.context!.linearRows();
    const references = aiTable.context!.references();
    let visibleFields = AITable.getVisibleFields(aiTable);
    let pasteCellsCount = 0;
    clipboardContent.forEach((row, i) => {
        const targetRowIndex = startRowIndex + i;
        if (maxRecords && targetRowIndex >= maxRecords) {
            result.isPasteOverMaxRecords = true;
            return;
        }
        row.forEach((plainText, j) => {
            if (maxPasteCellsCount && pasteCellsCount >= maxPasteCellsCount) {
                // 超过最大粘贴单元格数不做处理
                return;
            }
            const targetColIndex = startColIndex + j;
            if (maxFields && targetColIndex >= maxFields) {
                result.isPasteOverMaxFields = true;
                return;
            }
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
                    result.isPasteSuccess = true;
                } catch (error) {
                    console.error('Failed to paste value:', error);
                }
            }
            pasteCellsCount++;
        });
    });

    return result;
};
