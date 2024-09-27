import { Overlay } from '@angular/cdk/overlay';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThyPopover, ThyPopoverRef } from 'ngx-tethys/popover';
import { debounceTime, fromEvent, Subject } from 'rxjs';
import { AI_TABLE_OFFSET } from '../constants';
import { GRID_CELL_EDITOR_MAP } from '../constants/editor';
import { AITable, AITableFieldType, Coordinate } from '../core';
import { AITableGridCellRenderSchema, AITableOpenEditOptions } from '../types';
import { getCellHorizontalPosition } from '../utils';

@Injectable()
export class AITableGridEventService {
    aiTable!: AITable;

    aiFieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>;

    dblClickEvent$ = new Subject<MouseEvent>();

    mousedownEvent$ = new Subject<MouseEvent>();

    mouseoverEvent$ = new Subject<MouseEvent>();

    globalMouseoverEvent$ = new Subject<MouseEvent>();

    globalMousedownEvent$ = new Subject<MouseEvent>();

    private cellEditorPopoverRef!: ThyPopoverRef<any>;

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
        const component = this.getEditorComponent(this.aiTable.fieldsMap()[fieldId].type);
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
                fieldId: fieldId,
                recordId: recordId,
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

    openCanvasEdit(aiTable: AITable, options: AITableOpenEditOptions) {
        const { container, recordId, fieldId, position, isHoverEdit } = options;
        const { x, y, width, height } = position;
        const component = this.getEditorComponent(this.aiTable.fieldsMap()[fieldId].type);
        const originRect = container!.getBoundingClientRect();

        // 修正位置，以覆盖 cell border
        const yOffset = 3;
        const widthOffset = 1;
        const xBorderWidth = 2;
        const yBorderWidth = 2;
        const popoverWidth = isHoverEdit ? width - xBorderWidth : width + widthOffset;
        const popoverHeight = isHoverEdit ? height - yBorderWidth : height;
        const offset = isHoverEdit ? height - AI_TABLE_OFFSET * 2 : height;

        const ref = this.thyPopover.open(component, {
            origin: container!,
            originPosition: {
                x: x + originRect.x + AI_TABLE_OFFSET,
                y: y + originRect.y + yOffset + AI_TABLE_OFFSET,
                width,
                height
            },
            width: popoverWidth + 'px',
            height: popoverHeight + 'px',
            placement: 'top',
            offset: -offset,
            minWidth: popoverWidth,
            initialState: {
                fieldId: fieldId,
                recordId: recordId,
                aiTable: aiTable
            },
            panelClass: 'grid-cell-editor',
            outsideClosable: true,
            hasBackdrop: false,
            manualClosure: true,
            animationDisabled: true,
            autoAdaptive: true,
            scrollStrategy: this.overlay.scrollStrategies.close()
        });
        return ref;
    }

    openCellEditor(
        aiTable: AITable,
        options: { container: HTMLDivElement; coordinate: Coordinate; recordId: string; fieldId: string; isHoverEdit?: boolean }
    ) {
        const { container, coordinate, recordId, fieldId, isHoverEdit } = options;
        const { scrollState } = aiTable.context!;
        const { rowHeight, columnCount } = coordinate;
        const { rowIndex, columnIndex } = AITable.getCellIndex(aiTable, { recordId, fieldId })!;
        const x = coordinate.getColumnOffset(columnIndex);
        const y = coordinate.getRowOffset(rowIndex) + AI_TABLE_OFFSET;
        const columnWidth = coordinate.getColumnWidth(columnIndex);
        const { width, offset } = getCellHorizontalPosition({
            columnWidth,
            columnIndex,
            columnCount
        });
        this.cellEditorPopoverRef = this.openCanvasEdit(aiTable, {
            container,
            recordId,
            fieldId,
            position: {
                x: x + offset - scrollState().scrollLeft,
                y: y - scrollState().scrollTop,
                width,
                height: rowHeight
            },
            isHoverEdit
        });
        return this.cellEditorPopoverRef;
    }

    closeCellEditor() {
        this.cellEditorPopoverRef?.close();
    }
}
