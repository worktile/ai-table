import { Signal, WritableSignal } from '@angular/core';
import { Colors } from '../../constants/colors';
import { AITableSelection } from '../../types';
import { RendererContext } from '../context';
import { AITableAction } from './action';
import { AITableField, AITableFields, AITableRecord, AITableRecords } from './core';

export interface AITable {
    records: WritableSignal<AITableRecords>;
    fields: WritableSignal<AITableFields>;
    actions: AITableAction[];
    context?: RendererContext;
    selection: WritableSignal<AITableSelection>;
    recordsMap: Signal<{ [kay: string]: AITableRecord }>;
    fieldsMap: Signal<{ [kay: string]: AITableField }>;
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
    getActiveCell(aiTable: AITable): { recordId: string; fieldId: string } | null {
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
    getVisibleColumnsMap(aiTable: AITable) {
        const columns = AITable.getVisibleFields(aiTable);
        return new Map(columns?.map((item, index) => [item._id, index]));
    },
    getVisibleRowsIndexMap(aiTable: AITable) {
        return new Map(aiTable.context!.linearRows().map((row, index) => [row._id, index]));
    },
    isCellVisible(aiTable: AITable, cell: { recordId: string; fieldId: string }) {
        const visibleRowIndexMap = AITable.getVisibleRowsIndexMap(aiTable);
        const visibleColumnIndexMap = AITable.getVisibleColumnsMap(aiTable);
        return visibleRowIndexMap!.has(cell.recordId) && visibleColumnIndexMap.has(cell.fieldId);
    },
    getCellIndex(aiTable: AITable, cell: { recordId: string; fieldId: string }): { rowIndex: number; columnIndex: number } | null {
        const visibleColumnIndexMap = AITable.getVisibleColumnsMap(aiTable);
        const linearRowIndexMap = AITable.getVisibleRowsIndexMap(aiTable);
        if (AITable.isCellVisible(aiTable, cell)) {
            return {
                rowIndex: linearRowIndexMap!.get(cell.recordId)!,
                columnIndex: visibleColumnIndexMap.get(cell.fieldId)!
            };
        }
        return null;
    }
};
