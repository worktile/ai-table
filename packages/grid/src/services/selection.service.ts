import { computed, ElementRef, inject, Injectable, signal } from '@angular/core';
import { AITable, AITableDragState, Coordinate } from '../core';
import { AITableSelectAllState } from '../types';
import { AIRecordFieldIdPath, DragType } from '@ai-table/utils';
import { ScrollControllerService } from './scroll-controller.service';
import { AI_TABLE_FIELD_HEAD_HEIGHT } from '../constants';
@Injectable()
export class AITableGridSelectionService {
    aiTable!: AITable;

    private scrollControllerService = inject(ScrollControllerService);

    selectAllState = computed(() => {
        const selectedRecords = this.aiTable.selection().selectedRecords;
        return selectedRecords.size === this.aiTable.records().length
            ? AITableSelectAllState.all
            : selectedRecords.size === 0
              ? AITableSelectAllState.none
              : AITableSelectAllState.partial;
    });

    constructor() {}

    initialize(aiTable: AITable) {
        this.aiTable = aiTable;
        this.aiTable.dragState = signal({
            type: DragType.none,
            sourceIds: new Set()
        });
    }

    clearSelection() {
        this.aiTable.selection.set({
            selectedRecords: new Set(),
            selectedFields: new Set(),
            selectedCells: new Set(),
            activeCell: null,
            selectAllState: AITableSelectAllState.none
        });
    }

    setActiveCell(activeCell: AIRecordFieldIdPath) {
        this.aiTable.selection().activeCell = activeCell;
    }

    selectField(fieldId: string) {
        if (this.aiTable.selection().selectedFields.has(fieldId)) {
            return;
        }
        this.clearSelection();
        this.aiTable.selection().selectedFields.add(fieldId);
    }

    get selectedFields() {
        return this.aiTable.selection().selectedFields;
    }

    get selectedRecords() {
        return this.aiTable.selection().selectedRecords;
    }

    drag(config: AITableDragState) {
        this.aiTable.dragState!.set(config);
    }

    getDragStateType() {
        return this.aiTable.dragState?.()?.type;
    }

    clearDrag() {
        this.aiTable.dragState!.set({
            type: DragType.none,
            sourceIds: new Set()
        });
    }

    selectRecord(recordId: string) {
        if (this.aiTable.selection().selectedRecords.has(recordId)) {
            this.aiTable.selection().selectedRecords.delete(recordId);
        } else {
            this.aiTable.selection().selectedRecords.add(recordId);
        }
        const selectedRecords = this.aiTable.selection().selectedRecords;
        this.aiTable.selection.set({
            selectedRecords: selectedRecords,
            selectedFields: new Set(),
            selectedCells: new Set(),
            activeCell: null,
            selectAllState: this.selectAllState()
        });
    }

    toggleSelectAll(checked: boolean) {
        if (checked) {
            if (this.aiTable.records().length === 0) {
                this.aiTable.selection.set({
                    ...this.aiTable.selection(),
                    selectAllState: AITableSelectAllState.all
                });
            } else {
                this.aiTable.records().forEach((item) => {
                    this.selectRecord(item._id);
                });
            }
        } else {
            this.clearSelection();
        }
    }

    updateSelect(event: MouseEvent) {
        const target = event?.target as HTMLElement;
        if (!target) {
            return;
        }
        const cellDom = target.closest('.grid-cell');
        const colDom = target.closest('.grid-field');
        const checkbox = target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox' && target.closest('.grid-checkbox');
        const fieldAction = target.closest('.grid-field-action');
        if (cellDom) {
            const fieldId = cellDom.getAttribute('fieldId');
            const recordId = cellDom.getAttribute('recordId');
            fieldId && recordId && this.selectCells([recordId, fieldId]);
        }
        if (colDom && !fieldAction) {
            const fieldId = colDom.getAttribute('fieldId');
            fieldId && this.selectField(fieldId);
        }
        if (!cellDom && !colDom && !checkbox) {
            this.clearSelection();
        }
    }

    selectCells(startCell: AIRecordFieldIdPath, endCell?: AIRecordFieldIdPath) {
        const [startRecordId, startFieldId] = startCell;
        const records = this.aiTable.context!.linearRows();
        const fields = AITable.getVisibleFields(this.aiTable);
        const selectedCells = new Set<string>();

        if (!endCell) {
            selectedCells.add(`${startRecordId}:${startFieldId}`);
        } else {
            const [endRecordId, endFieldId] = endCell;

            const startRowIndex = this.aiTable.context!.visibleRowsIndexMap().get(startRecordId)!;
            const endRowIndex = this.aiTable.context!.visibleRowsIndexMap().get(endRecordId)!;
            const startColIndex = this.aiTable.context!.visibleColumnsIndexMap().get(startFieldId)!;
            const endColIndex = this.aiTable.context!.visibleColumnsIndexMap().get(endFieldId)!;

            const minRowIndex = Math.min(startRowIndex, endRowIndex);
            const maxRowIndex = Math.max(startRowIndex, endRowIndex);
            const minColIndex = Math.min(startColIndex, endColIndex);
            const maxColIndex = Math.max(startColIndex, endColIndex);

            for (let i = minRowIndex; i <= maxRowIndex; i++) {
                for (let j = minColIndex; j <= maxColIndex; j++) {
                    selectedCells.add(`${records[i]._id}:${fields[j]._id}`);
                }
            }
        }

        this.clearSelection();
        this.setActiveCell(startCell);
        this.aiTable.selection().selectedCells = selectedCells;
    }

    scrollCell(
        endCell: AIRecordFieldIdPath,
        coordinate: Coordinate,
        horizontalBarRef?: ElementRef<HTMLElement>,
        verticalBarRef?: ElementRef<HTMLElement>
    ) {
        const [recordId, fieldId] = endCell;

        const rowIndex = this.aiTable.context!.visibleRowsIndexMap().get(recordId)!;
        const colIndex = this.aiTable.context!.visibleColumnsIndexMap().get(fieldId)!;

        const cellTop = coordinate.getRowOffset(rowIndex);
        const cellLeft = coordinate.getColumnOffset(colIndex);
        const cellHeight = coordinate.getRowHeight(rowIndex);
        const cellWidth = coordinate.getColumnWidth(colIndex);

        const scrollState = this.aiTable.context!.scrollState();
        this.scrollControllerService.scroll({
            container: coordinate.container.getBoundingClientRect(),
            element: {
                top: cellTop - scrollState.scrollTop,
                left: cellLeft - scrollState.scrollLeft,
                height: cellHeight,
                width: cellWidth
            },
            direction: 'both',
            scrollableElement: {
                horizontalElement: horizontalBarRef?.nativeElement,
                verticalElement: verticalBarRef?.nativeElement
            },
            threshold: 10, // 预留10px空隙，避免正好贴边不滚动
            frozenArea: {
                top: AI_TABLE_FIELD_HEAD_HEIGHT,
                left: coordinate.getColumnWidth(0) + this.aiTable.context!.rowHeadWidth()
            }
        });
    }
}
