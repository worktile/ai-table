import { Injectable, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThyPopover, ThyPopoverRef } from 'ngx-tethys/popover';
import { debounceTime, fromEvent, Subject } from 'rxjs';
import { DBL_CLICK_EDIT_TYPE, MOUSEOVER_EDIT_TYPE } from '../constants';
import { GRID_CELL_EDITOR_MAP } from '../constants/editor';
import { AITable, AITableField, AITableFieldType, AITableRecord } from '../core';
import { AITableGridCellRenderSchema } from '../types';
import { getRecordOrField } from '../utils';

@Injectable()
export class AITableGridEventService {
    aiTable!: AITable;

    aiFieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>;

    takeUntilDestroyed = takeUntilDestroyed();

    mousedownEvent$ = new Subject<MouseEvent>();

    constructor(private thyPopover: ThyPopover) {}

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

        fromEvent<MouseEvent>(element, 'mouseover')
            .pipe(debounceTime(100), this.takeUntilDestroyed)
            .subscribe((event) => {
                this.mouseoverHandle(event as MouseEvent);
            });

        fromEvent<MouseEvent>(element, 'mousedown')
            .pipe(this.takeUntilDestroyed)
            .subscribe((event) => {
                this.mousedownEvent$.next(event as MouseEvent);
            });
    }

    private dblClick(event: MouseEvent) {
        const cellDom = (event.target as HTMLElement).closest('.grid-cell') as HTMLElement;
        const type = cellDom && (cellDom.getAttribute('type')! as AITableFieldType);
        if (type && DBL_CLICK_EDIT_TYPE.includes(type)) {
            this.openEdit(cellDom);
        }
    }

    private getEditorComponent(type: AITableFieldType) {
        if (this.aiFieldRenderers && this.aiFieldRenderers[type]) {
            return this.aiFieldRenderers[type]!.editor;
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
        const ref = this.thyPopover.open(component, {
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
            minWidth: width,
            initialState: {
                field: field,
                record: record,
                aiTable: this.aiTable
            },
            panelClass: 'grid-cell-editor',
            outsideClosable: false,
            hasBackdrop: false,
            manualClosure: true,
            animationDisabled: true
        });
        return ref;
    }

    mouseoverRef!: ThyPopoverRef<any>;

    private mouseoverHandle(event: MouseEvent) {
        if (this.mouseoverRef) {
            this.mouseoverRef?.close();
        }

        const cellDom = (event.target as HTMLElement).closest('.grid-cell') as HTMLElement;
        const type = cellDom && (cellDom.getAttribute('type')! as AITableFieldType);
        if (type && MOUSEOVER_EDIT_TYPE.includes(type)) {
            this.mouseoverRef = this.openEdit(cellDom);
        }
    }
}
