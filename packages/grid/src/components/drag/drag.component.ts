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

    private auxiliaryLine!: HTMLElement;

    private colResizeLine!: HTMLElement;

    private draggedData: DragEndData | null = null;

    private mouseStartPosition: { x: number; y: number } | null = null;

    private aiTableDrag: AITableDragState | null = null;

    private timer!: number | null;

    private mousedownListener?: () => void;
    private mousemoveListener?: () => void;
    private mouseupListener?: () => void;
    private lineMouseLeaveListener?: () => void;

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
        this.colResizeLine = this.elementRef.nativeElement.querySelector('.col-resize-line')!;
    }

    private setupEventListeners(): void {
        this.mousedownListener = this.render2.listen('window', 'mousedown', (e: MouseEvent) => {
            this.mouseStartPosition = { x: e.x, y: e.y };
        });

        this.mousemoveListener = this.render2.listen('window', 'mousemove', (e: MouseEvent) => {
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
            this.mouseStartPosition = null;
            this.aiTableDrag = null;
            this.handleDragEnd();
        });
    }

    private handleDragStateChange(): void {
        const drag = this.aiTableGridSelectionService.aiTable.dragState?.();

        if (!drag) {
            this.aiTableDrag = null;
            return;
        }

        if (drag.type === DragType.none || !this.rect || !this.auxiliaryLine) {
            return;
        }

        if (drag.type === DragType.columnWidth) {
            this.setDisplayStyle('block');
            this.showColResize(drag);
        }

        this.aiTableDrag = drag;
    }

    private handleDrag(e: MouseEvent, drag: AITableDragState) {
        if (drag.type === DragType.none) {
            return;
        }

        this.setDisplayStyle('block');
        const moveX = e.x - (this.mouseStartPosition?.x || 0);
        switch (drag.type) {
            case DragType.field:
                this.movingColumn(drag, moveX);
                break;
            case DragType.record:
                break;
            case DragType.columnWidth:
                this.movingColumnWidth(drag, moveX);
                break;
        }
    }

    private movingColumn(drag: AITableDragState, moveX: number) {
        const aiTable = this.aiTableGridSelectionService.aiTable;
        const scroll = drag.scroll || { x: 0, y: 0 };
        const coordinate = drag.coordinate!;
        const fields = aiTable.gridData().fields;
        const width = this.calculateDragWidth(fields, coordinate, drag);
        const visibleColumnIndexMap = aiTable.context!.visibleColumnsIndexMap();
        const sourceColumnIndex = visibleColumnIndexMap.get(drag.sourceIds.values().next().value!) || 0;
        const sourceColumnStartX = coordinate.getColumnOffset(sourceColumnIndex);
        const sourceColumnWidth = coordinate.getColumnWidth(sourceColumnIndex);
        // TODO: 目前默认第一列为冻结列，后期支持设置冻结列需要处理
        const isSourceColumnFrozen = sourceColumnIndex === 0;
        const pointerX = moveX + sourceColumnStartX;
        // 拖拽中心点
        const dragCenter = sourceColumnWidth / 2;
        this.setRectStyles({
            cursor: 'move',
            width: `${width}px`,
            height: '100%',
            top: '0',
            left: `${pointerX - (isSourceColumnFrozen ? 0 : scroll.x)}px`
        });

        const lastColumnOffset = coordinate.getColumnOffset(coordinate.columnCount - 1);
        const lastColumnWidth = coordinate.getColumnWidth(coordinate.columnCount - 1);

        let targetColumnIndex = coordinate.getColumnStartIndex(pointerX + (isSourceColumnFrozen ? scroll.x : 0) + dragCenter);
        let targetColumnStartX = coordinate.getColumnOffset(targetColumnIndex);
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
            this.setAuxiliaryLineStyles({
                width: '2px',
                height: '100%',
                top: '0',
                left: `${targetColumnStartX - scroll.x}px`
            });
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
            this.resetAuxiliaryLine();
            this.draggedData = null;
        }
    }

    private movingColumnWidth(drag: AITableDragState, moveX: number) {
        const aiTable = this.aiTableGridSelectionService.aiTable;
        const visibleColumnIndexMap = aiTable.context!.visibleColumnsIndexMap();
        const sourceColumnIndex = visibleColumnIndexMap.get(drag.sourceIds.values().next().value!) || 0;
        const sourceColumnStartX = drag.coordinate!.getColumnOffset(sourceColumnIndex);
        const sourceColumnWidth = drag.coordinate!.getColumnWidth(sourceColumnIndex);
        const scroll = drag.scroll || { x: 0, y: 0 };
        const pointerX = moveX + sourceColumnStartX;
        const colResizeX = pointerX - (sourceColumnIndex === 0 ? 0 : scroll.x);
        const left = `${colResizeX + sourceColumnWidth}px`;
        this.setAuxiliaryLineStyles({
            width: '2px',
            height: '100%',
            top: '0',
            left
        });
        this.draggedData = { type: DragType.columnWidth, fieldIds: drag.sourceIds, changeSize: moveX };
    }

    private showColResize(drag: AITableDragState) {
        const aiTable = this.aiTableGridSelectionService.aiTable;
        const visibleColumnIndexMap = aiTable.context!.visibleColumnsIndexMap();
        const sourceColumnIndex = visibleColumnIndexMap.get(drag.sourceIds.values().next().value!) || 0;
        const coordinate = drag.coordinate!;
        const sourceColumnStartX = coordinate.getColumnOffset(sourceColumnIndex);
        const scroll = drag.scroll || { x: 0, y: 0 };
        let targetColumnIndex = coordinate.getColumnStartIndex(sourceColumnStartX + scroll.x);
        let targetColumnStartX = coordinate.getColumnOffset(targetColumnIndex);
        const sourceColumnWidth = drag.coordinate!.getColumnWidth(sourceColumnIndex);
        const opacityLineWidth = 4;
        // 重置样式
        this.setRectStyles({ width: 0 });
        this.resetAuxiliaryLine();

        this.setDisplayStyle('block');
        this.render2.setStyle(this.elementRef.nativeElement, 'cursor', 'col-resize');
        // 隐藏列宽调整线，用于监听鼠标离开此区域后结束宽度调整
        this.setColResizeLine({
            opacity: 0,
            height: '100%',
            width: `${opacityLineWidth}px`,
            left: `${targetColumnStartX + sourceColumnWidth - opacityLineWidth / 2}px`
        });
        this.lineMouseLeaveListener = this.render2.listen(this.colResizeLine, 'mouseleave', () => {
            this.setDisplayStyle('none');
            this.lineMouseLeaveListener!();
            this.lineMouseLeaveListener = undefined;
        });
    }

    private handleDragEnd() {
        this.setDisplayStyle('none');
        if (this.draggedData) {
            this.dragEnd.emit({ ...this.draggedData });
            this.draggedData = null;
        }
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

    private setColResizeLine(styles: Record<string, any>) {
        Object.entries(styles).forEach(([prop, value]) => {
            this.render2.setStyle(this.colResizeLine, prop, value);
        });
    }

    private resetAuxiliaryLine(): void {
        this.render2.setStyle(this.auxiliaryLine, 'width', '0');
    }

    ngOnDestroy() {
        if (this.mousedownListener) this.mousedownListener();
        if (this.mousemoveListener) this.mousemoveListener();
        if (this.mouseupListener) this.mouseupListener();
        if (this.lineMouseLeaveListener) this.lineMouseLeaveListener();

        if (this.timer) {
            cancelAnimationFrame(this.timer);
            this.timer = null;
        }
    }
}
