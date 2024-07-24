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

    cellType(cell: HTMLElement) {
        const cellDom = cell.closest('.grid-cell');
        const colDom = cell.closest('.grid-column-field');
        if (cellDom && cellDom.getAttribute('fieldid') && cellDom.getAttribute('recordid')) {
            return { type: 'cell', element: cellDom };
        }
        if (colDom) {
            return { type: 'col', element: colDom };
        }
        return {};
    }

    updateSelect(event: MouseEvent) {
        const cell = this.cellType(event.target as HTMLElement);
        let fieldId = '';
        let recordId = '';
        if (cell.type) {
            fieldId = cell.element.getAttribute('fieldId')!;
            recordId = cell.element.getAttribute('recordId')!;
        }
        if (cell?.type === 'cell') {
            this.selectCell(recordId, fieldId);
        }
        if (cell?.type === 'col') {
            this.selectField(fieldId);
        }
    }
}
