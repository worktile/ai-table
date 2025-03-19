import { AITable, AITableFieldType, UpdateFieldValueOptions } from '../../core';
import { readFromClipboard, aiTableSpecialAttribute } from '../clipboard';

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

    pasteData.forEach((row, i) => {
        row.forEach((value, j) => {
            const targetRowIndex = startRowIndex + i;
            const targetColIndex = startColIndex + j;
            if (targetRowIndex >= linearRows.length || targetColIndex >= visibleFields.length) {
                return;
            }

            const targetRecord = linearRows[targetRowIndex];
            const targetField = visibleFields[targetColIndex];

            // TODO 完善 handlePasteData 逻辑之后，移除这个 if 判断
            if (targetField.type === AITableFieldType.text) {
                updateValueFn({
                    value: handlePasteData(aiTable, value, isJson),
                    path: [targetRecord._id, targetField._id]
                });
            }
        });
    });
};

export const handlePasteData = (aiTable: AITable, value: string, isJson: boolean) => {
    // TODO 处理不同 field 类型、处理边界粘贴
    return isJson ? (JSON.parse(value)?.cellFullText ?? value) : value;
};
