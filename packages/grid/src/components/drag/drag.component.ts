import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, OnDestroy, OnInit, output, Renderer2 } from '@angular/core';
import { AITableDragState, DragEndData, DragType } from '../../core';
import { AITableGridSelectionService } from '../../services/selection.service';

@Component({
    selector: 'ai-table-drag',
    templateUrl: './drag.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'drag-container'
    }
})
export class AITableDragComponent implements OnInit, OnDestroy {
    dragEnd = output<DragEndData>();

    private aiTableGridSelectionService = inject(AITableGridSelectionService);

    private render2 = inject(Renderer2);

    elementRef: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

    private rect!: HTMLElement;

    private line!: HTMLElement;

    private draggedData: DragEndData | null = null;

    private mouseStartPosition: { x: number; y: number } | null = null;

    private aiTableDrag: AITableDragState | null = null;

    private timer!: number | null;

    private mousedownListener?: () => void;
    private mousemoveListener?: () => void;
    private mouseupListener?: () => void;

    constructor() {
        effect(() => {
            const drag = this.aiTableGridSelectionService.aiTable.dragState?.();
            if (drag && drag.sourceIds.size > 0) {
                if (!this.rect || !this.line) {
                    return;
                }
                this.aiTableDrag = drag;
            } else {
                this.aiTableDrag = null;
            }
        });
    }

    ngOnInit() {
        this.rect = this.elementRef.nativeElement.querySelector('.rect')!;
        this.line = this.elementRef.nativeElement.querySelector('.line')!;
        this.mousedownListener = this.render2.listen('window', 'mousedown', (e) => {
            this.mouseStartPosition = { x: e.x, y: e.y };
        });
        this.mousemoveListener = this.render2.listen('window', 'mousemove', (e) => {
            if (this.timer) {
                cancelAnimationFrame(this.timer);
            }
            this.timer = requestAnimationFrame(() => {
                if (this.mouseStartPosition && this.aiTableDrag) {
                    this.handleDrag(e, this.aiTableDrag);
                }
            });
        });
        this.mouseupListener = this.render2.listen('window', 'mouseup', () => {
            this.mouseStartPosition = null;
            this.aiTableDrag = null;
            this.handleDragEnd();
        });
    }

    private handleDrag(e: MouseEvent, drag: AITableDragState) {
        if (drag.type !== DragType.none) {
            this.render2.setStyle(this.elementRef.nativeElement, 'display', 'block');
        } else {
            return;
        }
        const moveX = e.x - this.mouseStartPosition!.x;
        const aiTable = this.aiTableGridSelectionService.aiTable;
        const scroll = drag.scroll || { x: 0, y: 0 };
        const coordinate = drag.coordinate!;
        switch (drag.type) {
            case DragType.field:
                const fields = aiTable.gridData().fields;
                let width = 0;
                fields.forEach((field, index) => {
                    if (drag.sourceIds.has(field._id)) {
                        width += coordinate.columnIndicesSizeMap[index] || 0;
                    }
                });
                const visibleColumnIndexMap = aiTable.context!.visibleColumnsIndexMap();
                const sourceColumnIndex = visibleColumnIndexMap.get(drag.sourceIds.values().next().value!) || 0;
                const sourceColumnStartX = coordinate.getColumnOffset(sourceColumnIndex);
                const sourceColumnWidth = coordinate.getColumnWidth(sourceColumnIndex);
                // TODO: 目前默认第一列为冻结列，后期支持设置冻结列需要处理
                const isSourceColumnFrozen = sourceColumnIndex === 0;
                const pointerX = moveX + sourceColumnStartX;
                // 拖拽中心点
                const dragCenter = sourceColumnWidth / 2;
                let targetColumnIndex = coordinate.getColumnStartIndex(pointerX + (isSourceColumnFrozen ? scroll.x : 0) + dragCenter);
                let targetColumnStartX = coordinate.getColumnOffset(targetColumnIndex);
                this.render2.setStyle(this.rect, 'cursor', 'move');
                this.render2.setStyle(this.rect, 'width', `${width}px`);
                this.render2.setStyle(this.rect, 'height', `100%`);
                this.render2.setStyle(this.rect, 'top', 0);
                this.render2.setStyle(this.rect, 'left', `${pointerX - (isSourceColumnFrozen ? 0 : scroll.x)}px`);

                const lastColumnOffset = coordinate.getColumnOffset(coordinate.columnCount - 1);
                const lastColumnWidth = coordinate.getColumnWidth(coordinate.columnCount - 1);

                let isLastColumn = false;
                // 处理最后一列
                if (pointerX + dragCenter > lastColumnOffset + lastColumnWidth) {
                    targetColumnIndex = coordinate.columnCount;
                    targetColumnStartX = lastColumnOffset + lastColumnWidth;
                    isLastColumn = true;
                }
                if (
                    (targetColumnIndex >= 0 && (targetColumnIndex - sourceColumnIndex > 1 || targetColumnIndex - sourceColumnIndex < 0)) ||
                    isLastColumn
                ) {
                    this.render2.setStyle(this.line, 'width', `2px`);
                    this.render2.setStyle(this.line, 'height', `100%`);
                    this.render2.setStyle(this.line, 'top', 0);
                    this.render2.setStyle(this.line, 'left', `${targetColumnStartX - scroll.x}px`);
                    const fieldsIndex: number[] = [];
                    drag.sourceIds.forEach((id) => {
                        const index = visibleColumnIndexMap.get(id) || 0;
                        fieldsIndex.push(index);
                    });
                    // 向右移动目标在目标列的前一列
                    if (targetColumnIndex > sourceColumnIndex) {
                        targetColumnIndex -= 1;
                    }
                    this.draggedData = { type: DragType.field, targetIndex: targetColumnIndex, fieldIds: drag.sourceIds, fieldsIndex };
                } else {
                    this.render2.setStyle(this.line, 'width', 0);
                    this.draggedData = null;
                }
                break;
            case DragType.record:
                break;
            case DragType.columnWidth:
                break;
        }
    }

    private handleDragEnd() {
        this.render2.setStyle(this.elementRef.nativeElement, 'display', 'none');
        if (this.draggedData) {
            this.dragEnd.emit({ ...this.draggedData });
            this.draggedData = null;
        }
    }

    ngOnDestroy() {
        if (this.mousedownListener) this.mousedownListener();
        if (this.mousemoveListener) this.mousemoveListener();
        if (this.mouseupListener) this.mouseupListener();

        if (this.timer) {
            cancelAnimationFrame(this.timer);
            this.timer = null;
        }
    }
}
