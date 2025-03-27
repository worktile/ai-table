import { AITableContent, AITableReferences } from '../../types';
import {
    AITable,
    AITableField,
    AITableFieldType,
    AITableRecord,
    createDefaultField,
    createDefaultFieldName,
    FieldOptions,
    FieldValue,
    getFieldValue,
    idCreator,
    SelectSettings,
    UpdateFieldValueOptions
} from '../../core';
import { readFromClipboard, aiTableFragmentAttribute, extractText } from '../clipboard';
import { FieldModelMap } from '../field/model';
import { processPastedValueForSelect } from '../field/model/select';
import { AddRecordOptions, AddFieldOptions } from '../../core';

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

    if (targetField.type === AITableFieldType.attachment || (field && field.type === AITableFieldType.attachment)) {
        return { value: null, newField: null };
    }
    if (targetField.type !== AITableFieldType.link) {
        plainText = extractText(plainText);
    }

    let originData = field && record ? { field, cellValue: getFieldValue(record, field) } : null;
    if (targetField.type === AITableFieldType.select) {
        let { existOptionIds, newOptions } = processPastedValueForSelect(plainText, targetField, originData);

        newOptions = newOptions.map((option) => {
            return {
                ...option,
                _id: idCreator()
            };
        });
        const newField = {
            ...targetField,
            settings: {
                ...targetField.settings,
                options: [...((targetField.settings as SelectSettings)?.options || []), ...newOptions]
            }
        };
        const newOptionIds = newOptions.map((option) => option._id).filter((id) => !!id) as string[];
        const selectFieldValue = [...existOptionIds, ...newOptionIds];
        return {
            value: selectFieldValue,
            newField
        };
    }

    return { value: FieldModelMap[targetField.type].toFieldValue(plainText, targetField, originData, references), newField: null };
}

export interface AITablePasteActions {
    updateFieldValue: (data: UpdateFieldValueOptions) => void;
    setField: (field: AITableField) => void;
    addRecord: (data: AddRecordOptions) => void;
    addField: (data: AddFieldOptions) => void;
}

function appendRecord(aiTable: AITable, actions: AITablePasteActions) {
    const allRecords = aiTable.records();
    const lastRecordId = allRecords.length > 0 ? allRecords[allRecords.length - 1]._id : '';
    actions.addRecord({
        originId: lastRecordId
    });
}

function appendField(aiTable: AITable, originField: AITableField | null, actions: AITablePasteActions) {
    const lastFieldId = aiTable.fields().length > 0 ? aiTable.fields()[aiTable.fields().length - 1]._id : '';
    let defaultFieldValue: Partial<AITableField>;
    if (originField) {
        defaultFieldValue = {
            ...originField,
            name: createDefaultFieldName(aiTable, FieldOptions.find((item) => item.type === originField.type)!),
            _id: idCreator()
        };
    } else {
        defaultFieldValue = createDefaultField(aiTable, AITableFieldType.text);
    }

    actions.addField({
        originId: lastFieldId,
        defaultValue: defaultFieldValue
    });
}

export const writeToAITable = async (aiTable: AITable, actions: AITablePasteActions) => {
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
    const references = aiTable.context!.references();
    let isPasteSuccess = false;

    clipboardContent.forEach((row, i) => {
        const targetRowIndex = startRowIndex + i;
        if (targetRowIndex >= aiTable.context!.linearRows().length - 1) {
            appendRecord(aiTable, actions);
        }

        row.forEach((plainText, j) => {
            const targetColIndex = startColIndex + j;
            if (targetColIndex >= AITable.getVisibleFields(aiTable).length) {
                const originField = aiTableContent?.fields[j] || null;
                appendField(aiTable, originField, actions);
            }

            const targetRecord = aiTable.context!.linearRows()[targetRowIndex];
            const targetField = AITable.getVisibleFields(aiTable)[targetColIndex];
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
                } catch (error) {}
            }
        });
    });

    return isPasteSuccess;
};
