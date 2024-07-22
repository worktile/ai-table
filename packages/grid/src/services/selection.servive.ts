import { Injectable, Renderer2, WritableSignal, signal } from '@angular/core';
import { AITableSelection } from '../types';
import { AITable } from '../core';

@Injectable()
export class AITableGridSelectionService {
    aiTable!: AITable;

    lastClickCellElement?: HTMLElement;

    constructor(private renderer: Renderer2) {}

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

    selectCol(fieldId: string) {
        this.clearSelection();
        this.aiTable.selection().selectedFields.set(fieldId, true);
    }

    selectRow(recordId: string) {
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
                this.selectRow(item.id);
            });
        }
    }

    cellType(cell: HTMLElement) {
        const cellDom = cell.closest('.grid-cell');
        const rowDom = cell.closest('.grid-row-index');
        const colDom = cell.closest('.grid-column-field');
        const checkAllDom = cell.closest('.grid-column-checkbox');
        if (cellDom && cellDom.getAttribute('fieldid') && cellDom.getAttribute('recordid')) {
            return { type: 'cell', element: cellDom };
        }
        if (rowDom && cell.tagName === 'INPUT') {
            return { type: 'row', element: rowDom };
        }
        if (colDom) {
            return { type: 'col', element: colDom };
        }

        if (checkAllDom && cell.tagName === 'INPUT') {
            return { type: 'all', element: checkAllDom };
        }
        return {};
    }

    updateCellClass(dom: Element, operation: string) {
        const rowDom = dom.closest('.grid-row');
        const highlightCells = rowDom?.querySelectorAll('.grid-cell');
        highlightCells?.forEach((cell) => {
            operation === 'remove' ? this.renderer.removeClass(cell, 'highlight') : this.renderer.addClass(cell, 'highlight');
        });
        operation === 'remove' ? this.renderer.removeClass(dom, 'isSelected') : this.renderer.addClass(dom, 'isSelected');
    }

    updateColClass(dom: Element, operation: string) {
        const fieldId = dom.getAttribute('fieldid');
        const tableElement = dom.closest('ai-table-grid');
        const cells = tableElement?.querySelectorAll(`[fieldid="${fieldId}"]`);
        cells?.forEach((cell) => {
            operation === 'add' ? this.renderer.addClass(cell, 'highlight') : this.renderer.removeClass(cell, 'highlight');
        });
    }

    updateAllClass(dom: Element, operation: string, checked: boolean) {
        const tableElement = dom.closest('ai-table-grid');
        const rows = tableElement?.querySelectorAll('.grid-row');
        if (checked && operation === 'add') {
            rows?.forEach((row) => {
                this.renderer.addClass(row, 'highlight');
            });
        }
        if (operation === 'remove') {
            rows?.forEach((row) => {
                this.renderer.removeClass(row, 'highlight');
            });
        }
    }

    updateSelect(event: MouseEvent) {
        const cell = this.cellType(event.target as HTMLElement);
        let fieldId = '';
        let recordId = '';
        if (cell.type) {
            fieldId = cell.element.getAttribute('fieldId')!;
            recordId = cell.element.getAttribute('recordId')!;
        }
        if (this.lastClickCellElement) {
            const lastCell = this.cellType(this.lastClickCellElement);
            if (lastCell?.type === 'cell') {
                this.updateCellClass(this.lastClickCellElement, 'remove');
            }

            if (lastCell?.type === 'row' && cell?.type !== 'row' && cell.type) {
                const tableElement = lastCell.element.closest('ai-table-grid');
                const checkboxes = tableElement?.querySelectorAll('.checked-box');
                checkboxes?.forEach((box) => {
                    const row = box.closest('.grid-row');
                    this.renderer.removeClass(row, 'highlight');
                });
            }

            if (lastCell.type === 'col') {
                this.updateColClass(lastCell.element, 'remove');
            }

            if (lastCell?.type === 'all' && cell?.type !== 'row' && cell.type) {
                this.updateAllClass(cell.element, 'remove', false);
            }
        }

        if (cell?.type === 'cell') {
            this.selectCell(recordId, fieldId);
            this.updateCellClass(cell.element, 'add');
        }

        if (cell?.type === 'row') {
            const rowDom = cell.element.closest('.grid-row');
            if ((event.target as HTMLInputElement).checked) {
                this.renderer.addClass(rowDom, 'highlight');
            } else {
                this.renderer.removeClass(rowDom, 'highlight');
            }
        }

        if (cell?.type === 'col') {
            this.selectCol(fieldId);
            this.updateColClass(cell.element, 'add');
        }

        if (cell?.type === 'all') {
            this.updateAllClass(cell.element, 'add', (event.target as HTMLInputElement).checked);
        }

        if (cell.type) {
            this.lastClickCellElement = event.target as HTMLElement;
        }
    }
}
