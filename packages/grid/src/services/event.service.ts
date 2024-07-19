import { Injectable, Renderer2, signal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { DBL_CLICK_EDIT_TYPE } from '../constants';
import { getRecordOrField } from '../utils';
import { AITable, AITableField, AITableFieldType, AITableRecord } from '../core';
import { GRID_CELL_EDITOR_MAP } from '../constants/editor';
import { ThyPopover } from 'ngx-tethys/popover';
import { AITableGridCellRenderSchema } from '../types';

@Injectable()
export class AITableGridEventService {
    aiTable!: AITable;

    aiFieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>;

    takeUntilDestroyed = takeUntilDestroyed();

    lastClickCellElement?: HTMLElement;

    constructor(
        private thyPopover: ThyPopover,
        private renderer: Renderer2
    ) {}

    initialize(aiTable: AITable, aiFieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>) {
        this.aiTable = aiTable;
        this.aiFieldRenderers = aiFieldRenderers;
    }

    registerEvents(element: HTMLElement) {
        fromEvent<MouseEvent>(element, 'dblclick')
            .pipe(this.takeUntilDestroyed)
            .subscribe((event) => {
                this.dblClick(event as MouseEvent);
            });

        fromEvent<MouseEvent>(element, 'click')
            .pipe(this.takeUntilDestroyed)
            .subscribe((event) => {
                this.click(event as MouseEvent);
            });
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

    private click(event: MouseEvent) {
        const cell = this.cellType(event.target as HTMLElement);
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
            this.updateColClass(cell.element, 'add');
        }

        if (cell?.type === 'all') {
            this.updateAllClass(cell.element, 'add', (event.target as HTMLInputElement).checked);
        }

        this.lastClickCellElement = event.target as HTMLElement;
    }

    private cellType(cell: HTMLElement) {
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

    private dblClick(event: MouseEvent) {
        const cellDom = (event.target as HTMLElement).closest('.grid-cell') as HTMLElement;
        const type = cellDom && cellDom.getAttribute('type')!;
        if (type && DBL_CLICK_EDIT_TYPE.includes(Number(type))) {
            this.openEdit(cellDom);
        }
    }

    private getEditorComponent(type: AITableFieldType) {
        if (this.aiFieldRenderers && this.aiFieldRenderers[type]) {
            return this.aiFieldRenderers[type]!.edit;
        }
        return GRID_CELL_EDITOR_MAP[type];
    }

    private openEdit(cellDom: HTMLElement) {
        const { x, y, width, height } = cellDom.getBoundingClientRect();
        const fieldId = cellDom.getAttribute('fieldId')!;
        const recordId = cellDom.getAttribute('recordId')!;
        const field = getRecordOrField(this.aiTable.fields, fieldId) as Signal<AITableField>;
        const record = getRecordOrField(this.aiTable.records, recordId) as Signal<AITableRecord>;
        const component = this.getEditorComponent(field().type);
        this.thyPopover.open(component, {
            origin: cellDom,
            originPosition: {
                x: x - 1,
                y: y + 1,
                width: width + 2,
                height: height + 2
            },
            width: width + 2 + 'px',
            height: height + 2 + 'px',
            placement: 'top',
            offset: -(height + 4),
            initialState: {
                field: field,
                record: record,
                aiTable: signal(this.aiTable)
            },
            panelClass: 'grid-cell-editor',
            outsideClosable: false,
            hasBackdrop: false,
            manualClosure: true,
            animationDisabled: true
        });
    }
}
