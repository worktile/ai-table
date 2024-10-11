import { FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThyAbstractInternalOverlayRef } from 'ngx-tethys/core';
import { ThyPopover, ThyPopoverRef } from 'ngx-tethys/popover';
import { debounceTime, fromEvent, Subject } from 'rxjs';
import { AbstractEditCellEditor } from '../components';
import { AI_TABLE_CELL_BORDER, AI_TABLE_OFFSET, GRID_CELL_EDITOR_MAP } from '../constants';
import { AITable, AITableFieldType } from '../core';
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

    private cellEditorPopoverRef!: ThyPopoverRef<AbstractEditCellEditor<any>>;

    private destroyRef = inject(DestroyRef);

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
            autoAdaptive: true
        });
        return ref;
    }

    getOriginPosition(aiTable: AITable, options: AITableOpenEditOptions) {
        const { container, coordinate, recordId, fieldId, isHoverEdit } = options;
        const { scrollState } = aiTable.context!;
        const { rowHeight, columnCount } = coordinate;
        const { rowIndex, columnIndex } = AITable.getCellIndex(aiTable, { recordId, fieldId })!;
        const originX = coordinate.getColumnOffset(columnIndex);
        const originY = coordinate.getRowOffset(rowIndex) + AI_TABLE_OFFSET;
        const columnWidth = coordinate.getColumnWidth(columnIndex);
        const { width: originWidth, offset: originOffset } = getCellHorizontalPosition({
            columnWidth,
            columnIndex,
            columnCount
        });
        const originRect = container!.getBoundingClientRect();
        const originPosition = {
            x: originX + originOffset - scrollState().scrollLeft + originRect.x + AI_TABLE_OFFSET,
            y: originY - scrollState().scrollTop + originRect.y + AI_TABLE_OFFSET,
            width: originWidth,
            height: rowHeight
        };

        // 基于盒子模型：2px 的外边距算在了整个宽高中，所以为了和 canvas 渲染保持对齐，需要向左和向上各偏移 AI_TABLE_CELL_BORDER / 2
        // canvas 渲染差异：AI_TABLE_OFFSET 是根据情况进行的调整，减少高亮边框的重叠
        let x = originPosition.x - AI_TABLE_CELL_BORDER / 2 + AI_TABLE_OFFSET;
        let y = originPosition.y - AI_TABLE_CELL_BORDER / 2;
        let width = originPosition.width;
        let height = originPosition.height;
        if (isHoverEdit) {
            width = originPosition.width - AI_TABLE_CELL_BORDER;
            height = originPosition.height - AI_TABLE_CELL_BORDER;
            x = originPosition.x + AI_TABLE_CELL_BORDER / 2 + AI_TABLE_OFFSET;
            y = originPosition.y + AI_TABLE_CELL_BORDER / 2;
        }
        return {
            ...originPosition,
            x: x,
            y: y,
            width: width,
            height: height
        };
    }

    openCellEditor(aiTable: AITable, options: AITableOpenEditOptions) {
        const { container, recordId, fieldId, isHoverEdit } = options;
        const component = this.getEditorComponent(this.aiTable.fieldsMap()[fieldId].type);
        const offsetOriginPosition = this.getOriginPosition(aiTable, options);

        this.cellEditorPopoverRef = this.thyPopover.open(component, {
            origin: container!,
            originPosition: offsetOriginPosition,
            width: offsetOriginPosition.width + 'px',
            height: offsetOriginPosition.height + 'px',
            minWidth: offsetOriginPosition.width + 'px',
            placement: 'bottom',
            offset: -offsetOriginPosition.height,
            initialState: {
                fieldId: fieldId,
                recordId: recordId,
                aiTable: aiTable
            },
            panelClass: 'grid-cell-editor',
            outsideClosable: false,
            hasBackdrop: false,
            manualClosure: true,
            animationDisabled: true,
            autoAdaptive: true
        });

        if (this.cellEditorPopoverRef) {
            const wheelEvent = fromEvent<WheelEvent>(
                this.cellEditorPopoverRef.componentInstance.elementRef.nativeElement,
                'wheel'
            ).subscribe((event: WheelEvent) => {
                event.preventDefault();
                this.aiTable.context?.scrollAction({
                    deltaX: event.deltaX,
                    deltaY: event.deltaY,
                    shiftKey: event.shiftKey,
                    callback: () => {
                        const originPosition = this.getOriginPosition(aiTable, options);
                        const positionStrategy = (this.cellEditorPopoverRef as ThyAbstractInternalOverlayRef<any, any, any>)
                            .getOverlayRef()
                            .getConfig().positionStrategy as FlexibleConnectedPositionStrategy;
                        positionStrategy.setOrigin(originPosition);
                        positionStrategy.apply();
                    }
                });
            });
            this.cellEditorPopoverRef.afterClosed().subscribe(() => {
                wheelEvent.unsubscribe();
            });
        }
        return this.cellEditorPopoverRef;
    }

    closeCellEditor() {
        if (this.cellEditorPopoverRef) {
            this.cellEditorPopoverRef.close();
        }
    }

    getCurrentEditCell() {
        if (this.cellEditorPopoverRef) {
            const recordId = this.cellEditorPopoverRef.componentInstance?.recordId;
            const fieldId = this.cellEditorPopoverRef.componentInstance?.fieldId;

            if (recordId && fieldId) {
                return {
                    recordId,
                    fieldId
                };
            }
            return null;
        }
        return null;
    }
}
