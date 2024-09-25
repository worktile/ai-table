import { Overlay } from '@angular/cdk/overlay';
import { DestroyRef, inject, Injectable, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThyPopover } from 'ngx-tethys/popover';
import { debounceTime, fromEvent, Subject } from 'rxjs';
import { AI_TABLE_OFFSET } from '../constants';
import { GRID_CELL_EDITOR_MAP } from '../constants/editor';
import { AITable, AITableField, AITableFieldType, AITableRecord, Coordinate } from '../core';
import { AITableGridCellRenderSchema, AITableOpenEditOptions } from '../types';
import { getCellHorizontalPosition, getRecordOrField } from '../utils';

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
        const { container, recordId, fieldId, position } = options;
        const { x, y, width, height } = position;
        const field = getRecordOrField(this.aiTable.fields, fieldId) as Signal<AITableField>;
        const record = getRecordOrField(this.aiTable.records, recordId) as Signal<AITableRecord>;
        const component = this.getEditorComponent(field().type);
        const originRect = container!.getBoundingClientRect();

        // 修正位置，以覆盖 cell border
        const yOffset = 3;
        const widthOffset = 1;

        const ref = this.thyPopover.open(component, {
            origin: container!,
            originPosition: {
                x: x + originRect.x + AI_TABLE_OFFSET,
                y: y + originRect.y + yOffset + AI_TABLE_OFFSET,
                width: width,
                height: height
            },
            width: width + widthOffset + 'px',
            height: height + 'px',
            placement: 'top',
            offset: -height,
            minWidth: width,
            initialState: {
                field: field,
                record: record,
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

    openEditByDblClick(
        aiTable: AITable,
        options: { container: HTMLDivElement; coordinate: Coordinate; recordId: string; fieldId: string }
    ) {
        const { container, coordinate, recordId, fieldId } = options;
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
        this.openCanvasEdit(aiTable, {
            container,
            recordId,
            fieldId,
            position: {
                x: x + offset - scrollState().scrollLeft,
                y: y - scrollState().scrollTop,
                width,
                height: rowHeight
            }
        });
    }
}
