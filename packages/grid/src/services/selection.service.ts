import { Injectable } from '@angular/core';
import { AIRecordFieldIdPath, AITable } from '../core';
import { AITableSelectAllState } from '../types';

@Injectable()
export class AITableGridSelectionService {
    aiTable!: AITable;

    get selectAllState() {
        const selectedRecords = this.aiTable.selection().selectedRecords;
        return selectedRecords.size === this.aiTable.records().length
            ? AITableSelectAllState.all
            : selectedRecords.size === 0
              ? AITableSelectAllState.none
              : AITableSelectAllState.partial;
    }

    constructor() {}

    initialize(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    clearSelection() {
        this.aiTable.selection.set({
            selectedRecords: new Set(),
            selectedFields: new Set(),
            selectedCells: new Set(),
            activeCell: null,
            selectAllState: AITableSelectAllState.none
        });
    }

    setActiveCell(activeCell: AIRecordFieldIdPath) {
        this.aiTable.selection().activeCell = activeCell;
    }

    selectField(fieldId: string) {
        if (this.aiTable.selection().selectedFields.has(fieldId)) {
            return;
        }
        this.clearSelection();
        this.aiTable.selection().selectedFields.add(fieldId);
    }

    selectRecord(recordId: string) {
        if (this.aiTable.selection().selectedRecords.has(recordId)) {
            this.aiTable.selection().selectedRecords.delete(recordId);
        } else {
            this.aiTable.selection().selectedRecords.add(recordId);
        }
        const selectedRecords = this.aiTable.selection().selectedRecords;
        this.aiTable.selection.set({
            selectedRecords: selectedRecords,
            selectedFields: new Set(),
            selectedCells: new Set(),
            activeCell: null,
            selectAllState: this.selectAllState
        });
    }

    toggleSelectAll(checked: boolean) {
        if (checked) {
            if (this.aiTable.records().length === 0) {
                this.aiTable.selection.set({
                    ...this.aiTable.selection(),
                    selectAllState: AITableSelectAllState.all
                });
            } else {
                this.aiTable.records().forEach((item) => {
                    this.selectRecord(item._id);
                });
            }
        } else {
            this.clearSelection();
        }
    }

    updateSelect(event: MouseEvent) {
        const target = event?.target as HTMLElement;
        if (!target) {
            return;
        }
        const cellDom = target.closest('.grid-cell');
        const colDom = target.closest('.grid-field');
        const checkbox = target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox' && target.closest('.grid-checkbox');
        const fieldAction = target.closest('.grid-field-action');
        if (cellDom) {
            const fieldId = cellDom.getAttribute('fieldId');
            const recordId = cellDom.getAttribute('recordId');
            fieldId && recordId && this.selectCells([recordId, fieldId]);
        }
        if (colDom && !fieldAction) {
            const fieldId = colDom.getAttribute('fieldId');
            fieldId && this.selectField(fieldId);
        }
        if (!cellDom && !colDom && !checkbox) {
            this.clearSelection();
        }
    }

    selectCells(startCell: AIRecordFieldIdPath, endCell?: AIRecordFieldIdPath) {
        const [startRecordId, startFieldId] = startCell;
        const records = this.aiTable.records();
        const fields = this.aiTable.fields();
        const selectedCells = new Set<string>();

        if (!endCell) {
            selectedCells.add(`${startRecordId}:${startFieldId}`);
        } else {
            const [endRecordId, endFieldId] = endCell;

            const startRowIndex = records.findIndex((record) => record._id === startRecordId);
            const endRowIndex = records.findIndex((record) => record._id === endRecordId);
            const startColIndex = fields.findIndex((field) => field._id === startFieldId);
            const endColIndex = fields.findIndex((field) => field._id === endFieldId);

            const minRowIndex = Math.min(startRowIndex, endRowIndex);
            const maxRowIndex = Math.max(startRowIndex, endRowIndex);
            const minColIndex = Math.min(startColIndex, endColIndex);
            const maxColIndex = Math.max(startColIndex, endColIndex);

            for (let i = minRowIndex; i <= maxRowIndex; i++) {
                for (let j = minColIndex; j <= maxColIndex; j++) {
                    selectedCells.add(`${records[i]._id}:${fields[j]._id}`);
                }
            }
        }

        this.clearSelection();
        this.setActiveCell(startCell);
        this.aiTable.selection().selectedCells = selectedCells;
    }
}
