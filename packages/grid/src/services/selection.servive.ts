import { Injectable } from '@angular/core';
import { AITable } from '../core';

@Injectable()
export class AITableGridSelectionService {
    aiTable!: AITable;

    constructor() {}

    initialize(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    clearSelection() {
        this.aiTable.selection.set({
            selectedRecords: new Map(),
            selectedFields: new Map(),
            selectedCells: new Map()
        });
    }

    selectCell(recordId: string, fieldId: string) {
        this.clearSelection();
        this.aiTable.selection().selectedCells.set(recordId, { [fieldId]: true });
    }

    selectField(fieldId: string) {
        this.clearSelection();
        this.aiTable.selection().selectedFields.set(fieldId, true);
    }

    selectRecord(recordId: string) {
        if (this.aiTable.selection().selectedRecords.has(recordId)) {
            this.aiTable.selection().selectedRecords.delete(recordId);
        } else {
            this.aiTable.selection().selectedRecords.set(recordId, true);
        }
        this.aiTable.selection.set({
            selectedRecords: this.aiTable.selection().selectedRecords,
            selectedFields: new Map(),
            selectedCells: new Map()
        });
    }

    toggleSelectAll(checked: boolean) {
        this.clearSelection();
        if (checked) {
            this.aiTable.records().forEach((item) => {
                this.selectRecord(item.id);
            });
        }
    }

    updateSelect(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const cellDom = target.closest('.grid-cell');
        const colDom = target.closest('.grid-column-field');
        if (cellDom) {
            const fieldId = cellDom.getAttribute('fieldId');
            const recordId = cellDom.getAttribute('recordId');
            fieldId && recordId && this.selectCell(recordId, fieldId);
        }
        if (colDom) {
            const fieldId = colDom.getAttribute('fieldId');
            fieldId && this.selectField(fieldId);
        }
    }
}
