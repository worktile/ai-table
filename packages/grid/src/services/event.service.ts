import { Overlay } from '@angular/cdk/overlay';
import { DestroyRef, inject, Injectable, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThyPopover } from 'ngx-tethys/popover';
import { debounceTime, fromEvent, Subject } from 'rxjs';
import { GRID_CELL_EDITOR_MAP } from '../constants/editor';
import { AITable, AITableField, AITableFieldType, AITableRecord } from '../core';
import { AITableGridCellRenderSchema } from '../types';
import { getRecordOrField } from '../utils';

@Injectable()
export class AITableGridEventService {
    aiTable!: AITable;

    aiFieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>;

    dblClickEvent$ = new Subject<MouseEvent>();

    mousedownEvent$ = new Subject<MouseEvent>();

    mouseoverEvent$ = new Subject<MouseEvent>();

    globalMouseoverEvent$ = new Subject<MouseEvent>();

    globalMousedownEvent$ = new Subject<MouseEvent>();

    private destroyRef = inject(DestroyRef);

    private overlay = inject(Overlay);

    private thyPopover = inject(ThyPopover);

    initialize(aiTable: AITable, aiFieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>) {
        this.aiTable = aiTable;
        this.aiFieldRenderers = aiFieldRenderers;
    }

    registerEvents(element: HTMLElement) {
        fromEvent<MouseEvent>(element, 'dblclick', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                this.dblClickEvent$.next(event);
            });

        fromEvent<MouseEvent>(element, 'mouseover', { passive: true })
            .pipe(debounceTime(80), takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                this.mouseoverEvent$.next(event);
            });

        fromEvent<MouseEvent>(document, 'mouseover', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                this.globalMouseoverEvent$.next(event);
            });

        fromEvent<MouseEvent>(element, 'mousedown', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                this.mousedownEvent$.next(event);
            });

        fromEvent<MouseEvent>(document, 'mousedown', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event) => {
                this.globalMousedownEvent$.next(event as MouseEvent);
            });
    }

    private getEditorComponent(type: AITableFieldType) {
        if (this.aiFieldRenderers && this.aiFieldRenderers[type]) {
            return this.aiFieldRenderers[type]!.editor;
        }
        return GRID_CELL_EDITOR_MAP[type];
    }

    openEdit(cellDom: HTMLElement) {
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
            width: width + 1 + 'px',
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
            animationDisabled: true,
            autoAdaptive: true,
            scrollStrategy: this.overlay.scrollStrategies.close()
        });
        return ref;
    }

    openCanvasEdit(options: {
        aiTable: AITable;
        container: HTMLDivElement;
        recordId: string;
        fieldId: string;
        position: { x: number; y: number; width: number; height: number };
    }) {
        const { aiTable, container, recordId, fieldId, position } = options;
        const { x, y, width, height } = position;
        const field = getRecordOrField(this.aiTable.fields, fieldId) as Signal<AITableField>;
        const record = getRecordOrField(this.aiTable.records, recordId) as Signal<AITableRecord>;
        const component = this.getEditorComponent(field().type);
        const originRect = container.getBoundingClientRect();

        // 修正位置，以覆盖 cell border
        const yOffset = 2;
        const widthOffset = 3;

        const ref = this.thyPopover.open(component, {
            origin: container,
            originPosition: {
                x: x + originRect.x,
                y: y + originRect.y - yOffset,
                width: width,
                height: height
            },
            width: width + widthOffset + 'px',
            height: height + 'px',
            placement: 'top',
            offset: -(height + 4),
            minWidth: width,
            initialState: {
                field: field,
                record: record,
                aiTable: aiTable
            },
            panelClass: 'grid-cell-editor',
            outsideClosable: false,
            hasBackdrop: false,
            manualClosure: true,
            animationDisabled: true,
            autoAdaptive: true,
            scrollStrategy: this.overlay.scrollStrategies.close()
        });
        return ref;
    }
}
