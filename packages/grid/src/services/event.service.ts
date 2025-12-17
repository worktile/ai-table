import { FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThyAbstractInternalOverlayRef } from 'ngx-tethys/core';
import { ThyPopover, ThyPopoverRef } from 'ngx-tethys/popover';
import { debounceTime, fromEvent, Subject } from 'rxjs';
import { AbstractEditCellEditor } from '../components';
import { GRID_CELL_EDITOR_MAP } from '../components/cell-editors';
import { AITable } from '../core';
import { AITableContextMenuOptions, AITableGridCellRenderSchema, AITableOpenEditOptions } from '../types';
import { closeEditingCell, closeExpendCell, getCellHorizontalPosition, getEditorBoxOffset, getEditorSpace, setEditingCell } from '../utils';
import { AITableContextMenu } from '../components/context-menu/context-menu.component';
import { AITableFieldType, AIRecordFieldIdPath, UpdateFieldValueOptions } from '@ai-table/utils';
import { AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE } from '../constants';

@Injectable()
export class AITableGridEventService {
    aiTable!: AITable;

    aiFieldRenderers?: Partial<Record<AITableFieldType | string, AITableGridCellRenderSchema>>;

    dblClickEvent$ = new Subject<MouseEvent>();

    mousedownEvent$ = new Subject<MouseEvent>();

    mouseoverEvent$ = new Subject<MouseEvent>();

    globalMouseoverEvent$ = new Subject<MouseEvent>();

    globalMousedownEvent$ = new Subject<MouseEvent>();

    private cellEditorPopoverRef!: ThyPopoverRef<AbstractEditCellEditor<any>> | null;

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

    private getEditorComponent(type: AITableFieldType | string) {
        const filedRenderSchema = this.aiFieldRenderers && this.aiFieldRenderers[type];
        if (filedRenderSchema && filedRenderSchema.editor) {
            return {
                component: filedRenderSchema.editor,
                isInternalComponent: false
            };
        }
        return {
            component: GRID_CELL_EDITOR_MAP[type],
            isInternalComponent: true
        };
    }

    openEdit(cellDom: HTMLElement) {
        const { x, y, width, height } = cellDom.getBoundingClientRect();
        const fieldId = cellDom.getAttribute('fieldId')!;
        const recordId = cellDom.getAttribute('recordId')!;
        const { component } = this.getEditorComponent(this.aiTable.fieldsMap()[fieldId].type);
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
            // manualClosure: true,
            animationDisabled: true,
            autoAdaptive: true
        });
        return ref;
    }

    getOriginPosition(aiTable: AITable, options: AITableOpenEditOptions) {
        const { container, coordinate, recordId, fieldId } = options;
        const { scrollState } = aiTable.context!;
        const { rowHeight, columnCount } = coordinate;
        const cell: AIRecordFieldIdPath = [recordId, fieldId];
        const { rowIndex, columnIndex } = AITable.getCellIndex(aiTable, cell)!;
        const originX = coordinate.getColumnOffset(columnIndex);
        const originY = coordinate.getRowOffset(rowIndex);
        const columnWidth = coordinate.getColumnWidth(columnIndex);

        const row = aiTable.context?.linearRows()[rowIndex];
        const depth = row?.depth ?? 0;
        const isGroupAndFirstColumn = depth > 0 && columnIndex === 0;
        let { width: originWidth, offset: originOffset } = getCellHorizontalPosition({
            columnWidth,
            columnIndex,
            columnCount,
            depth
        });
        if (isGroupAndFirstColumn) {
            originOffset += AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE;
        }
        const originRect = container!.getBoundingClientRect();
        const isFrozenColumn = AITable.isFrozenColumn(aiTable, columnIndex);
        const scrollLeft = isFrozenColumn ? 0 : scrollState().scrollLeft;
        const scrollTop = scrollState().scrollTop;
        const originPosition = {
            x: originX + originOffset - scrollLeft + originRect.x,
            y: originY - scrollTop + originRect.y,
            width: originWidth,
            height: rowHeight
        };
        let x = originPosition.x + getEditorBoxOffset();
        let y = originPosition.y + getEditorBoxOffset();
        let width = getEditorSpace(originPosition.width);
        let height = getEditorSpace(originPosition.height);
        return {
            ...originPosition,
            x: x,
            y: y,
            width: width,
            height: height
        };
    }

    openCellEditor(aiTable: AITable, options: AITableOpenEditOptions) {
        const { container, recordId, fieldId, references } = options;
        const fieldType = this.aiTable.fieldsMap()[fieldId].type;
        const { component, isInternalComponent } = this.getEditorComponent(fieldType);
        const offsetOriginPosition = this.getOriginPosition(aiTable, options);

        setEditingCell(aiTable, { path: [recordId, fieldId] });
        closeExpendCell(this.aiTable);
        this.cellEditorPopoverRef = this.thyPopover.open(component, {
            viewContainerRef: isInternalComponent ? undefined : options?.viewContainerRef,
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
                references,
                aiTable: aiTable,
                isSelectAll: options.isSelectAll,
                recordHeight: offsetOriginPosition.height
            },
            panelClass: 'grid-cell-editor',
            outsideClosable: fieldType === AITableFieldType.link ? true : false,
            hasBackdrop: false,
            // manualClosure: true,
            animationDisabled: true,
            autoAdaptive: true
        });

        if (this.cellEditorPopoverRef) {
            const wheelEvent = fromEvent<WheelEvent>(
                this.cellEditorPopoverRef.componentInstance.elementRef.nativeElement,
                'wheel'
            ).subscribe((event: WheelEvent) => {
                const field = aiTable.fieldsMap()[fieldId];
                if (field.type === AITableFieldType.text || field.type === AITableFieldType.richText) {
                    return;
                }
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
                this.cellEditorPopoverRef = null;
                closeEditingCell(this.aiTable);
            });
            (this.cellEditorPopoverRef.componentInstance as AbstractEditCellEditor<any>).updateFieldValues.subscribe(
                (value: UpdateFieldValueOptions[]) => {
                    options.updateFieldValues(value);
                }
            );
        }
        return this.cellEditorPopoverRef;
    }

    closeCellEditor() {
        if (this.cellEditorPopoverRef) {
            this.cellEditorPopoverRef.close();
            this.cellEditorPopoverRef = null;
            closeEditingCell(this.aiTable);
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

    openContextMenu(aiTable: AITable, options: AITableContextMenuOptions) {
        const { origin, position, menuItems, targetName, viewContainerRef } = options;
        const ref = this.thyPopover.open(AITableContextMenu, {
            origin: origin as HTMLElement,
            originPosition: position,
            placement: 'bottomLeft',
            insideClosable: true,
            viewContainerRef,
            initialState: {
                aiTable,
                menuItems,
                targetName,
                position
            }
        });
        return ref;
    }
}
