import { AITable, FieldValue, UpdateFieldValueOptions } from '../../core';
import { readFromClipboard, aiTableSpecialAttribute } from '../clipboard';
import { ViewOperationMap } from '../field/model';

const aiTableAttributePattern = new RegExp(`${aiTableSpecialAttribute}="(.+?)"`, 'm');

const decodeClipboardJsonData = (encoded: string) => {
    const decoded = decodeURIComponent(window.atob(encoded));
    return JSON.parse(decoded);
};

const readClipboardData = async (): Promise<{ pasteData: string[][]; isJson: boolean }> => {
    const clipboardData = await readFromClipboard();
    let pasteData: string[][];

    if (clipboardData && clipboardData.html) {
        const aiTableAttribute = clipboardData.html.match(aiTableAttributePattern);
        if (aiTableAttribute && aiTableAttribute[1]) {
            pasteData = decodeClipboardJsonData(aiTableAttribute[1]);
            return {
                pasteData,
                isJson: true
            };
        }
    }

    if (clipboardData && clipboardData.text) {
        pasteData = clipboardData.text
            .split('\n')
            .map((row) => row.split('\t'))
            .filter((row) => row.length > 0 && row.some((cell) => cell.trim().length > 0));

        return {
            pasteData,
            isJson: false
        };
    }

    return {
        pasteData: [],
        isJson: false
    };
};

export const writeToAITable = async (aiTable: AITable, updateValueFn: (data: UpdateFieldValueOptions) => void) => {
    const selectedCells = Array.from(aiTable.selection().selectedCells);
    if (!selectedCells.length) {
        return;
    }
    const { pasteData, isJson } = await readClipboardData();
    if (!pasteData.length) {
        return;
    }

    const [firstCell] = selectedCells;
    const [startRecordId, startFieldId] = firstCell.split(':');

    const startRowIndex = aiTable.context!.visibleRowsIndexMap().get(startRecordId) ?? 0;
    const startColIndex = aiTable.context!.visibleColumnsIndexMap().get(startFieldId) ?? 0;
    const visibleFields = AITable.getVisibleFields(aiTable);
    const linearRows = aiTable.context!.linearRows();
    const references = aiTable.context!.references();

    pasteData.forEach((row, i) => {
        row.forEach((data, j) => {
            const targetRowIndex = startRowIndex + i;
            const targetColIndex = startColIndex + j;
            if (targetRowIndex >= linearRows.length || targetColIndex >= visibleFields.length) {
                return;
            }

            const targetRecord = linearRows[targetRowIndex];
            const targetField = visibleFields[targetColIndex];

            let value: FieldValue | null = null;
            if (isJson) {
                const jsonData = JSON.parse(data);
                const field = aiTable.fieldsMap()[jsonData.fieldId!];
                const cellValue = jsonData.cellValue;
                const originData = {
                    field,
                    cellValue
                };
                value = ViewOperationMap[targetField.type].pasteValue(jsonData.cellFullText, targetField, originData, references);
            } else {
                value = ViewOperationMap[targetField.type].pasteValue(data, targetField, null, references);
            }

            if (value !== null) {
                updateValueFn({
                    value,
                    path: [targetRecord._id, targetField._id]
                });
            }
        });
    });
};
