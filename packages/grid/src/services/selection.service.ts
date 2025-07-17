import { computed, Injectable } from '@angular/core';
import { AITable } from '../core';
import { AITableSelectAllState } from '../types';
import { AIRecordFieldIdPath } from '@ai-table/utils';

@Injectable()
export class AITableGridSelectionService {
    aiTable!: AITable;

    selectAllState = computed(() => {
        const selectedRecords = this.aiTable.selection().selectedRecords;
        return selectedRecords.size === this.aiTable.records().length
            ? AITableSelectAllState.all
            : selectedRecords.size === 0
              ? AITableSelectAllState.none
              : AITableSelectAllState.partial;
    });

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
            expandCell: null,
            editingCell: null,
            selectAllState: AITableSelectAllState.none
        });
    }

    setActiveCell(activeCell: AIRecordFieldIdPath) {
        this.aiTable.selection().activeCell = activeCell;
    }

    setExpandCell(expandCell: AIRecordFieldIdPath) {
        this.aiTable.selection.set({
            ...this.aiTable.selection(),
            expandCell: expandCell
        });
    }

    setEditingCell(editingCell: AIRecordFieldIdPath | null) {
        this.aiTable.selection.set({
            ...this.aiTable.selection(),
            editingCell: editingCell
        });
    }

    selectField(fieldId: string) {
        if (this.aiTable.selection().selectedFields.has(fieldId)) {
            return;
        }
        this.clearSelection();
        this.aiTable.selection().selectedFields.add(fieldId);
    }

    get selectedFields() {
        return this.aiTable.selection().selectedFields;
    }

    get selectedRecords() {
        return this.aiTable.selection().selectedRecords;
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
            expandCell: null,
            editingCell: null,
            selectAllState: this.selectAllState()
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

    selectCells(startCell: AIRecordFieldIdPath, endCell?: AIRecordFieldIdPath, activeCell?: AIRecordFieldIdPath | null) {
        const [startRecordId, startFieldId] = startCell;
        const records = this.aiTable.context!.linearRows();
        const fields = AITable.getVisibleFields(this.aiTable);
        const selectedCells = new Set<string>();

        if (!endCell) {
            selectedCells.add(`${startRecordId}:${startFieldId}`);
        } else {
            const [endRecordId, endFieldId] = endCell;

            const startRowIndex = this.aiTable.context!.visibleRowsIndexMap().get(startRecordId)!;
            const endRowIndex = this.aiTable.context!.visibleRowsIndexMap().get(endRecordId)!;
            const startColIndex = this.aiTable.context!.visibleColumnsIndexMap().get(startFieldId)!;
            const endColIndex = this.aiTable.context!.visibleColumnsIndexMap().get(endFieldId)!;

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
        this.setActiveCell(activeCell || startCell);
        this.aiTable.selection().selectedCells = selectedCells;
    }
}
