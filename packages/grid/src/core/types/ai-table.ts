import { WritableSignal } from '@angular/core';
import { Colors } from '../../constants/colors';
import { AITableCell, AITableSelection } from '../../types';
import { AITableAction } from './action';
import { AITableFields, AITableRecord, AITableRecords } from './core';

export interface AITable {
    records: WritableSignal<AITableRecords>;
    fields: WritableSignal<AITableFields>;
    actions: AITableAction[];
    selection: WritableSignal<AITableSelection>;
    onChange: () => void;
    apply: (action: AITableAction) => void;
}

export type AIPlugin = (aiTable: AITable) => AITable;

export const AITable = {
    getColors() {
        return Colors;
    },
    getVisibleFields(aiTable: AITable) {
        return aiTable.fields().filter((field) => !field.hidden);
    },
    getVisibleRows(aiTable: AITable) {
        return aiTable.records();
    },
    hasSelectedCell(aiTable: AITable) {
        return aiTable.selection().selectedCells.size > 0;
    },
    getSelection(aiTable: AITable) {
        const selection = aiTable && aiTable.selection();
        const hasSelectedCell = AITable.hasSelectedCell(aiTable);

        if (hasSelectedCell) {
            return null;
        }
        return selection;
    },
    getSelectedRecords(aiTable: AITable) {
        const selection = AITable.getSelection(aiTable);
        return selection ? Array.from(selection.selectedRecords) : undefined;
    },
    getSelectedFields(aiTable: AITable) {
        const selection = AITable.getSelection(aiTable);
        return selection ? Array.from(selection.selectedFields) : undefined;
    },
    getSelectedField(aiTable: AITable) {
        if (!AITable.hasSelectedCell(aiTable)) {
            return;
        }
        const { fields } = aiTable;
        const selection = AITable.getSelection(aiTable);
        const selectedFieldIds = [...selection!.selectedFields.keys()];
        return fields().find((field) => field._id === selectedFieldIds[0]);
    },
    getSelectedRecord(aiTable: AITable) {
        if (!AITable.hasSelectedCell(aiTable)) {
            return;
        }
        const { records } = aiTable;
        const selection = AITable.getSelection(aiTable);
        const selectedRecordIds = [...selection!.selectedRecords.keys()];
        return records().find((record) => record._id === selectedRecordIds[0]);
    },
    getActiveCell(aiTable: AITable): AITableCell | null {
        const selection = aiTable.selection();
        let selectedCells = [];
        for (let [recordId, fieldIds] of selection.selectedCells.entries()) {
            for (let fieldId of Object.keys(fieldIds)) {
                if ((fieldIds as { [key: string]: boolean })[fieldId]) {
                    selectedCells.push({
                        recordId,
                        fieldId
                    });
                }
            }
        }
        return selectedCells ? selectedCells[0] : null;
    },
    getCellValue(aiTable: AITable, recordId: string, fieldId: string) {
        const { records } = aiTable;
        const rowValue = records().find((item: AITableRecord) => item._id === recordId);
        return rowValue ? rowValue.values[fieldId] : null;
    }
};
