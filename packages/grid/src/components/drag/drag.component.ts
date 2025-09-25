import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    Input,
    OnDestroy,
    OnInit,
    output,
    Renderer2,
    Signal
} from '@angular/core';
import { DragDirection, DragEndData, DragType } from '@ai-table/utils';
import { MIN_COLUMN_WIDTH } from '../../constants/grid';
import {
    AI_TABLE_AUTO_SCROLL_BOTTOM_THRESHOLD,
    AI_TABLE_AUTO_SCROLL_LEFT_THRESHOLD,
    AI_TABLE_AUTO_SCROLL_RIGHT_THRESHOLD,
    AI_TABLE_AUTO_SCROLL_TOP_THRESHOLD,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT,
    AI_TABLE_ROW_DRAG_ICON_WIDTH,
    AI_TABLE_SCROLL_BAR_SIZE
} from '../../constants/table';
import { AITableDragState } from '../../core';
import { AITableScrollControllerService } from '../../services/scroll-controller.service';
import { AITableGridEventService } from '../../services';
import { AITableRowType } from '../../types/row';

@Component({
    selector: 'ai-table-drag',
    templateUrl: './drag.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-drag-container'
    }
})
export class AITableDragComponent implements OnInit, OnDestroy {
    horizontalBar = input<ElementRef<HTMLElement> | undefined>();

    verticalBar = input<ElementRef<HTMLElement> | undefined>();

    dragEnd = output<DragEndData>();

    private aiTableGridEventService = inject(AITableGridEventService);

    private render2 = inject(Renderer2);

    private scrollControllerService = inject(AITableScrollControllerService);

    elementRef: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

    private rect!: HTMLElement;

    private auxiliaryLine!: HTMLElement;

    private draggedData: DragEndData | null = null;

    private scrollBarStartPosition: { x: number; y: number } = { x: 0, y: 0 };

    private mouseStartPosition: { x: number; y: number } | null = null;

    private aiTableDrag: AITableDragState | null = null;

    private timer!: number | null;

    private mouseDownTimeout: any = null;

    private isDraggingEnabled: boolean = false;

    private containerWidth: number = 0;

    private containerHeight: number = 0;

    private horizontalBarElement?: HTMLElement;

    private horizontalBarMaxScroll: number = 0;

    private verticalBarElement?: HTMLElement;

    private verticalBarMaxScroll: number = 0;

    private mousedownListener?: () => void;
    private mousemoveListener?: () => void;
    private mouseupListener?: () => void;

    constructor() {
        effect(() => this.handleDragStateChange());
    }

    ngOnInit() {
        this.initElements();
        this.setupEventListeners();
    }

    private initElements(): void {
        this.rect = this.elementRef.nativeElement.querySelector('.rect')!;
        this.auxiliaryLine = this.elementRef.nativeElement.querySelector('.auxiliary-line')!;
    }

    private setupEventListeners(): void {
        this.mousedownListener = this.render2.listen('window', 'mousedown', (e: MouseEvent) => {
            this.mouseStartPosition = { x: e.x, y: e.y };

            if (this.mouseDownTimeout) {
                clearTimeout(this.mouseDownTimeout);
            }
            this.isDraggingEnabled = false;

            this.horizontalBarElement = this.horizontalBar()?.nativeElement;
            this.horizontalBarMaxScroll = (this.horizontalBarElement?.scrollWidth || 0) - (this.horizontalBarElement?.clientWidth || 0);
            this.verticalBarElement = this.verticalBar()?.nativeElement;
            this.verticalBarMaxScroll = (this.verticalBarElement?.scrollHeight || 0) - (this.verticalBarElement?.clientHeight || 0);
            this.scrollBarStartPosition = { x: this.horizontalBarElement?.scrollLeft || 0, y: this.verticalBarElement?.scrollTop || 0 };
            this.mouseDownTimeout = setTimeout(() => {
                this.isDraggingEnabled = true;
            }, 200);
        });

        this.mousemoveListener = this.render2.listen('window', 'mousemove', (e: MouseEvent) => {
            if (!this.isDraggingEnabled) {
                return;
            }
            if (this.timer) {
                cancelAnimationFrame(this.timer);
            }
            this.timer = requestAnimationFrame(() => {
                if (this.aiTableDrag && this.mouseStartPosition) {
                    this.handleDrag(e, this.aiTableDrag);
                }
            });
        });

        this.mouseupListener = this.render2.listen('window', 'mouseup', () => {
            if (this.mouseDownTimeout) {
                clearTimeout(this.mouseDownTimeout);
                this.mouseDownTimeout = null;
            }

            this.isDraggingEnabled = false;
            this.mouseStartPosition = null;
            this.aiTableDrag = null;
            this.handleDragEnd();
        });
    }

    private handleDragStateChange(): void {
        const drag = this.aiTableGridEventService.aiTable.dragState?.();

        if (!drag) {
            this.aiTableDrag = null;
            return;
        }

        if (drag.type === DragType.none || !this.rect || !this.auxiliaryLine) {
            return;
        }

        this.aiTableDrag = drag;
    }

    private handleDrag(e: MouseEvent, drag: AITableDragState) {
        if (drag.type === DragType.none) {
            return;
        }
        this.setDisplayStyle('block');
        this.containerWidth = this.elementRef.nativeElement.offsetWidth;
        this.containerHeight = this.elementRef.nativeElement.offsetHeight;
        const moveX = e.x - (this.mouseStartPosition?.x || 0);
        const moveY = e.y - (this.mouseStartPosition?.y || 0);
        let direction: DragDirection = DragDirection.none;
        switch (drag.type) {
            case DragType.field:
                if (e.movementX > 0) {
                    direction = DragDirection.right;
                } else if (e.movementX < 0) {
                    direction = DragDirection.left;
                }
                if (direction !== DragDirection.none) {
                    this.movingColumn(drag, moveX, direction);
                }
                break;
            case DragType.record:
                this.movingRecord(drag, moveY);
                break;
            case DragType.columnWidth:
                this.movingColumnWidth(drag, moveX);
                break;
        }
    }

    private movingColumn(drag: AITableDragState, moveX: number, direction: DragDirection) {
        const aiTable = this.aiTableGridEventService.aiTable;
        const scroll = { x: this.horizontalBarElement?.scrollLeft || 0, y: 0 };
        const coordinate = drag.coordinate!;
        const fields = aiTable.gridData().fields;
        const width = this.calculateDragWidth(fields, coordinate, drag);
        const visibleColumnIndexMap = aiTable.context!.visibleColumnsIndexMap();
        const rowHeadWidth = aiTable.context!.rowHeadWidth();
        const sourceColumnIndex = visibleColumnIndexMap.get(drag.sourceIds.values().next().value!) || 0;
        const sourceColumnStartX = coordinate.getColumnOffset(sourceColumnIndex);
        const sourceColumnWidth = coordinate.getColumnWidth(sourceColumnIndex);

        const frozenColumnCount = aiTable.context!.frozenColumnCount();
        const isSourceColumnFrozen = sourceColumnIndex <= frozenColumnCount - 1;
        const frozenColumnWidth = Array.from({ length: frozenColumnCount }).reduce(
            (acc: number, _, index) => acc + coordinate.getColumnWidth(index),
            0
        );
        const pointerX = moveX + sourceColumnStartX;
        // 拖拽中心点
        const dragCenter = sourceColumnWidth / 2;

        const currentRectLeft = pointerX - (isSourceColumnFrozen ? 0 : this.scrollBarStartPosition.x);
        let newScrollPosition = { x: scroll.x, y: scroll.y };

        this.setRectStyles({
            cursor: 'move',
            width: `${width}px`,
            height: '100%',
            top: '0',
            left: `${currentRectLeft}px`
        });

        const currentRectLeftIsInFrozenArea =
            currentRectLeft <
            frozenColumnWidth +
                rowHeadWidth +
                (direction === DragDirection.left || direction === DragDirection.none
                    ? -AI_TABLE_AUTO_SCROLL_LEFT_THRESHOLD
                    : AI_TABLE_AUTO_SCROLL_LEFT_THRESHOLD);

        // 是否在冻结列区域内拖拽
        const isFrozenColumnAreaDrag = isSourceColumnFrozen || currentRectLeftIsInFrozenArea;
        // 计算目标列和辅助线
        const updateTargetAndLine = (rectLeft: number, scrollPosition: { x: number; y: number }) => {
            if (currentRectLeftIsInFrozenArea) {
                // 冻结列区域内滚动，清空滚动位置
                scrollPosition.x = 0;
            }
            let targetColumnIndex = coordinate.getColumnStartIndex(rectLeft + scrollPosition.x + dragCenter);
            const lastColumnOffset = coordinate.getColumnOffset(coordinate.columnCount - 1);
            const lastColumnWidth = coordinate.getColumnWidth(coordinate.columnCount - 1);
            const lastColumnEndX = lastColumnOffset + lastColumnWidth;

            let targetColumnStartX = coordinate.getColumnOffset(targetColumnIndex);
            let isLastColumn = false;

            // 处理最后一列
            if (rectLeft + dragCenter + scrollPosition.x > lastColumnEndX) {
                targetColumnIndex = coordinate.columnCount;
                targetColumnStartX = lastColumnOffset + lastColumnWidth;
                isLastColumn = true;
            }

            if (
                (targetColumnIndex >= 0 && (targetColumnIndex - sourceColumnIndex > 1 || targetColumnIndex - sourceColumnIndex < 0)) ||
                isLastColumn
            ) {
                let lineLeft = targetColumnStartX - scrollPosition.x;
                const lineForFrozenX = lineLeft - frozenColumnWidth - rowHeadWidth;
                const rectDistanceFrozenX = rectLeft - frozenColumnWidth - rowHeadWidth;

                if (lineForFrozenX < 0) {
                    if (Math.abs(rectDistanceFrozenX) < dragCenter) {
                        // 滚动中保持上一个位置
                        const nextColumnStartX = coordinate.getColumnOffset(targetColumnIndex + 1);
                        this.setAuxiliaryLineStyles({
                            left: `${nextColumnStartX - scrollPosition.x}px`
                        });
                        this.draggedData = {
                            type: DragType.field,
                            targetIndex: targetColumnIndex + 1,
                            fieldIds: drag.sourceIds,
                            fieldsIndex: Array.from(drag.sourceIds).map((id) => visibleColumnIndexMap.get(id) || 0)
                        };
                        return;
                    }
                }

                this.setAuxiliaryLineStyles({
                    width: '2px',
                    height: '100%',
                    top: 0,
                    left: `${lineLeft}px`
                });

                // 向右移动目标在目标列的前一列
                if (targetColumnIndex > sourceColumnIndex) {
                    targetColumnIndex -= 1;
                }

                this.draggedData = {
                    type: DragType.field,
                    targetIndex: targetColumnIndex,
                    fieldIds: drag.sourceIds,
                    fieldsIndex: Array.from(drag.sourceIds).map((id) => visibleColumnIndexMap.get(id) || 0)
                };
            } else {
                this.resetAuxiliaryLine();
                this.draggedData = null;
            }
        };

        updateTargetAndLine(currentRectLeft, newScrollPosition);

        if (currentRectLeftIsInFrozenArea) {
            // 冻结列区域内拖拽取消滚动
            this.scrollControllerService.stopAutoScroll();
            return;
        }
        this.scrollControllerService.scroll({
            container: {
                width: this.containerWidth,
                height: this.containerHeight
            },
            target: {
                x: currentRectLeft,
                y: 0,
                width: sourceColumnWidth,
                height: this.containerHeight
            },
            direction: 'horizontal',
            scrollableElement: {
                horizontalElement: this.horizontalBarElement
            },
            frozenArea: {
                left: frozenColumnWidth + rowHeadWidth
            },
            edgeThreshold: {
                left: AI_TABLE_AUTO_SCROLL_LEFT_THRESHOLD,
                right: AI_TABLE_SCROLL_BAR_SIZE + AI_TABLE_AUTO_SCROLL_RIGHT_THRESHOLD
            },
            onScrollChange: (position, isAutoScrolling) => {
                newScrollPosition = position;
                if (isAutoScrolling && position.x > 0 && Math.round(position.x) < this.horizontalBarMaxScroll) {
                    updateTargetAndLine(currentRectLeft, position);
                }
            }
        });
    }

    private movingColumnWidth(drag: AITableDragState, moveX: number) {
        this.setCursorStyle('col-resize');
        const aiTable = this.aiTableGridEventService.aiTable;
        const visibleColumnIndexMap = aiTable.context!.visibleColumnsIndexMap();
        const sourceColumnIndex = visibleColumnIndexMap.get(drag.sourceIds.values().next().value!) || 0;
        const sourceColumnStartX = drag.coordinate!.getColumnOffset(sourceColumnIndex);
        const sourceColumnWidth = drag.coordinate!.getColumnWidth(sourceColumnIndex);
        const scroll = { x: this.horizontalBarElement?.scrollLeft || 0, y: this.verticalBarElement?.scrollTop || 0 };
        const pointerX = moveX + sourceColumnStartX;
        const colResizeX = pointerX - (sourceColumnIndex === 0 ? 0 : scroll.x);
        const left = `${colResizeX + sourceColumnWidth}px`;
        this.setAuxiliaryLineStyles({
            width: '2px',
            height: '100%',
            top: '0',
            left
        });
        let minWidth = MIN_COLUMN_WIDTH;
        drag.sourceIds.forEach((id) => {
            const field = aiTable.fieldsMap()[id];
            const fieldOption = aiTable.context!.fieldOptionMap().get(field.type);
            if (fieldOption && fieldOption.minWidth) {
                minWidth = Math.max(minWidth, fieldOption.minWidth);
            }
        });
        this.draggedData = {
            type: DragType.columnWidth,
            fieldIds: drag.sourceIds,
            width: Math.max(minWidth, sourceColumnWidth + moveX)
        };
    }

    private movingRecord(drag: AITableDragState, moveY: number) {
        const aiTable = this.aiTableGridEventService.aiTable;
        const scroll = { x: 0, y: this.verticalBarElement?.scrollTop || 0 };
        const coordinate = drag.coordinate!;

        const linearRows = aiTable.context!.linearRows();
        const visibleRowIndexMap = aiTable.context!.visibleRowsIndexMap();
        const sourceRowId = drag.sourceIds.values().next().value!;
        const sourceRowIndex = visibleRowIndexMap.get(sourceRowId) || 0;
        const sourceRowStartY = coordinate.getRowOffset(sourceRowIndex);
        const sourceRowHeight = coordinate.getRowHeight(sourceRowIndex);
        const pointerY = sourceRowStartY + moveY;
        const rectTop = pointerY - this.scrollBarStartPosition.y;
        this.setRectStyles({
            width: '100%',
            height: `${sourceRowHeight}px`,
            top: `${rectTop}px`,
            left: '0'
        });
        let newScrollPosition = { x: scroll.x, y: scroll.y };
        const updateTargetAndLine = (rectTop: number, scrollPosition: { x: number; y: number }) => {
            const dragCenter = sourceRowHeight / 2;
            const targetRowIndex = coordinate.getRowStartIndex(rectTop + scrollPosition.y + dragCenter);
            const targetRowStartY = coordinate.getRowOffset(targetRowIndex);
            const lineHeight = 2;
            if (
                (targetRowIndex >= 0 && sourceRowIndex > targetRowIndex && sourceRowIndex - targetRowIndex > 0) ||
                (sourceRowIndex < targetRowIndex && targetRowIndex - sourceRowIndex > 1)
            ) {
                let lineTop = targetRowStartY - scrollPosition.y;
                if (lineTop < AI_TABLE_FIELD_HEAD_HEIGHT) {
                    // 滚动中保持上一个位置
                    const nextColumnStartY = coordinate.getRowOffset(targetRowIndex + 1);
                    this.setAuxiliaryLineStyles({
                        top: `${nextColumnStartY - scrollPosition.y}px`
                    });
                    this.setMovingRecordDragData(DragType.record, drag.sourceIds, targetRowIndex + 1);
                    return;
                }
                const currentLinearRow = linearRows[targetRowIndex];
                const rowType = currentLinearRow.type;
                if (rowType === AITableRowType.record || rowType === AITableRowType.add) {
                    this.setAuxiliaryLineStyles({
                        width: `calc(100% - ${AI_TABLE_ROW_DRAG_ICON_WIDTH}px)`,
                        height: `${lineHeight}px`,
                        top: `${lineTop}px`,
                        left: `${AI_TABLE_ROW_DRAG_ICON_WIDTH}px`
                    });
                    this.setMovingRecordDragData(DragType.record, drag.sourceIds, targetRowIndex);
                }
            } else {
                this.resetAuxiliaryLine();
                this.draggedData = null;
            }
        };
        updateTargetAndLine(rectTop, newScrollPosition);
        this.scrollControllerService.scroll({
            container: {
                width: this.containerWidth,
                height: this.containerHeight
            },
            target: {
                x: 0,
                y: rectTop,
                width: this.containerWidth,
                height: sourceRowHeight
            },
            direction: 'vertical',
            scrollableElement: {
                verticalElement: this.verticalBarElement
            },
            frozenArea: {
                top: AI_TABLE_FIELD_HEAD_HEIGHT,
                bottom: this.containerHeight - AI_TABLE_SCROLL_BAR_SIZE - AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT
            },
            edgeThreshold: {
                top: AI_TABLE_AUTO_SCROLL_TOP_THRESHOLD,
                bottom: AI_TABLE_AUTO_SCROLL_BOTTOM_THRESHOLD
            },
            onScrollChange: (position, isAutoScrolling) => {
                newScrollPosition = position;
                if (isAutoScrolling && position.y > 0 && position.y < this.verticalBarMaxScroll) {
                    updateTargetAndLine(rectTop, newScrollPosition);
                }
            }
        });
    }

    private setMovingRecordDragData(type: DragType, sourceIds: Set<string>, targetIndex: number) {
        const aiTable = this.aiTableGridEventService.aiTable;
        const linearRows = aiTable.context!.linearRows();
        this.draggedData = {
            type,
            recordIds: sourceIds,
            targetIndex
        };
        if (targetIndex === 0) {
            this.draggedData.beforeRecordId = linearRows[0]._id;
        } else {
            const targetLinearRow = linearRows[targetIndex - 1];
            if (targetLinearRow.type === AITableRowType.group) {
                this.draggedData.beforeRecordId = linearRows[targetIndex]._id;
            } else {
                this.draggedData.afterRecordId = targetLinearRow._id;
            }
        }
    }

    private handleDragEnd() {
        if (this.draggedData) {
            this.dragEnd.emit({ ...this.draggedData });
        }
        this.clearDragState();
    }

    private clearDragState() {
        this.setDisplayStyle('none');
        this.setRectStyles({
            width: '0',
            height: '0',
            top: '0',
            left: '0'
        });
        this.setAuxiliaryLineStyles({
            width: '0',
            height: '0',
            top: '0',
            left: '0'
        });
        this.draggedData = null;
    }

    private calculateDragWidth(fields: any[], coordinate: any, drag: AITableDragState): number {
        let width = 0;
        fields.forEach((field, index) => {
            if (drag.sourceIds.has(field._id)) {
                width += coordinate.columnIndicesSizeMap[index] || 0;
            }
        });
        return width;
    }

    private setDisplayStyle(display: string) {
        this.render2.setStyle(this.elementRef.nativeElement, 'display', display);
    }

    private setCursorStyle(cursor: string) {
        this.render2.setStyle(this.elementRef.nativeElement, 'cursor', cursor);
    }

    private setRectStyles(styles: Record<string, any>) {
        Object.entries(styles).forEach(([prop, value]) => {
            this.render2.setStyle(this.rect, prop, value);
        });
    }

    private setAuxiliaryLineStyles(styles: Record<string, any>) {
        Object.entries(styles).forEach(([prop, value]) => {
            this.render2.setStyle(this.auxiliaryLine, prop, value);
        });
    }

    private resetAuxiliaryLine(): void {
        this.setAuxiliaryLineStyles({ width: 0, height: 0, top: '0', left: '0' });
    }

    ngOnDestroy() {
        if (this.mousedownListener) this.mousedownListener();
        if (this.mousemoveListener) this.mousemoveListener();
        if (this.mouseupListener) this.mouseupListener();

        if (this.timer) {
            cancelAnimationFrame(this.timer);
            this.timer = null;
        }
        this.scrollControllerService.destroy();
    }
}
