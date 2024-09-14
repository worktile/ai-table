import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    OnInit,
    Signal,
    signal,
    viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';
import { fromEvent, map } from 'rxjs';
import {
    AI_TABLE_CELL,
    AI_TABLE_FIELD_ADD_BUTTON,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_ROW_ADD_BUTTON,
    AI_TABLE_ROW_HEAD_WIDTH,
    AI_TABLE_ROW_SELECT_CHECKBOX,
    DBL_CLICK_EDIT_TYPE,
    DEFAULT_POINT_POSITION,
    DEFAULT_SCROLL_STATE
} from './constants';
import { AITable, AITableField, Coordinate, RendererContext } from './core';
import { AITableGridBase } from './grid-base.component';
import { createGridStage } from './renderer/creations/create-grid-stage';
import { AITableGridEventService } from './services/event.service';
import { AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';
import { AITableMouseDownType } from './types';
import { buildGridLinearRows, getColumnIndicesMap, getDetailByTargetName, getRecordOrField, handleMouseStyle, isWindowsOS } from './utils';
import { getMousePosition } from './utils/position';

@Component({
    selector: 'ai-table-grid',
    templateUrl: './grid.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid'
    },
    providers: [AITableGridEventService, AITableGridFieldService, AITableGridSelectionService]
})
export class AITableGrid extends AITableGridBase implements OnInit {
    timer: number | null | undefined;

    gridStage!: Stage;

    coordinate!: Coordinate;

    fieldHeadHeight = AI_TABLE_FIELD_HEAD_HEIGHT;

    ADD_BUTTON_WIDTH = AI_TABLE_FIELD_ADD_BUTTON_WIDTH;

    isRenderDone = signal(false);

    container = viewChild<ElementRef>('container');

    verticalBarRef = viewChild<ElementRef>('verticalBar');

    horizontalBarRef = viewChild<ElementRef>('horizontalBar');

    gridLinearRows = computed(() => {
        return buildGridLinearRows(this.aiRecords());
    });

    containerElement = computed(() => {
        return this.container()?.nativeElement;
    });

    constructor() {
        super();

        afterNextRender(() => {
            this.initGridRender();
            this.bindWheel();
            this.isRenderDone.set(true);
        });
        effect(() => {
            if (this.isRenderDone()) {
                this.bindScrollBarScroll();
            }
        });
        effect(() => {
            this.initGridRender();
        });
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.aiTable.context = this.initContext();
    }

    private initContext() {
        return new RendererContext({
            linearRows: this.gridLinearRows,
            pointPosition: signal(DEFAULT_POINT_POSITION),
            scrollState: signal(DEFAULT_SCROLL_STATE)
        });
    }

    private initCoordinate() {
        const fields = AITable.getVisibleFields(this.aiTable);
        return new Coordinate({
            container: this.containerElement(),
            rowHeight: AI_TABLE_FIELD_HEAD_HEIGHT,
            rowCount: (this.aiTable.context as RendererContext).linearRows().length,
            columnCount: fields.length,
            rowInitSize: AI_TABLE_FIELD_HEAD_HEIGHT,
            columnInitSize: AI_TABLE_ROW_HEAD_WIDTH,
            rowIndicesMap: {},
            columnIndicesMap: getColumnIndicesMap(fields),
            frozenColumnCount: 1
        });
    }

    private initGridRender() {
        this.coordinate = this.initCoordinate();
        this.gridStage = createGridStage({
            aiTable: this.aiTable,
            container: this.container()?.nativeElement!,
            width: this.containerElement().offsetWidth,
            height: this.containerElement().offsetHeight,
            coordinate: this.coordinate
        });
        this.gridStage.draw();
        this.bindEvent();
    }

    private bindEvent() {
        const context = this.aiTable.context as RendererContext;
        this.gridStage.on('mousemove', (e: KonvaEventObject<MouseEvent>) => {
            if (this.timer) {
                cancelAnimationFrame(this.timer);
            }
            this.timer = requestAnimationFrame(() => {
                const targetName = e.target.name();
                const pos = this.gridStage?.getPointerPosition();
                if (pos == null) return;
                const { x, y } = pos;
                const curMousePosition = getMousePosition(
                    x,
                    y,
                    this.coordinate,
                    AITable.getVisibleFields(this.aiTable),
                    context,
                    targetName
                );
                handleMouseStyle(curMousePosition.realTargetName, curMousePosition.areaType, this.containerElement());
                context.setPointPosition(curMousePosition);
                this.timer = null;
            });
        });
        this.gridStage.on('mousedown', (e: KonvaEventObject<MouseEvent>) => {
            const mouseEvent = e.evt;
            const _targetName = e.target.name();

            const { targetName, fieldId, recordId } = getDetailByTargetName(_targetName);
            switch (targetName) {
                case AI_TABLE_FIELD_HEAD: {
                    mouseEvent.preventDefault();
                    if (!fieldId) return;
                    this.aiTableGridSelectionService.selectField(fieldId);
                    return;
                }
                case AI_TABLE_CELL: {
                    if (!recordId || !fieldId) return;
                    this.aiTableGridSelectionService.selectCell(recordId, fieldId);
                    return;
                }
                // case AI_TABLE_FIELD_HEAD_MORE:{
                //  弹出菜单
                //    return
                // }
                case AI_TABLE_ROW_ADD_BUTTON:
                case AI_TABLE_FIELD_ADD_BUTTON:
                case AI_TABLE_ROW_SELECT_CHECKBOX:
                case AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX:
                    return;
                default:
                    this.aiTableGridSelectionService.clearSelection();
            }
        });
        this.gridStage.on('click', (e: KonvaEventObject<MouseEvent>) => {
            const mouseEvent = e.evt;
            mouseEvent.preventDefault();
            const { targetName, rowIndex: pointRowIndex, x, y } = context.pointPosition();
            if (mouseEvent.button !== AITableMouseDownType.Left) return;
            switch (targetName) {
                case AI_TABLE_ROW_ADD_BUTTON: {
                    this.aiTableGridSelectionService.clearSelection();
                    this.addRecord();
                    return;
                }
                case AI_TABLE_ROW_SELECT_CHECKBOX: {
                    const pointRecordId = context.linearRows()[pointRowIndex]?._id;
                    this.selectRecord(pointRecordId);
                    return;
                }
                case AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX: {
                    const isChecked = this.aiTable.selection().selectedRecords.size === this.aiTable.records().length;
                    this.toggleSelectAll(!isChecked);
                    return;
                }
                case AI_TABLE_FIELD_ADD_BUTTON: {
                    this.aiTableGridSelectionService.clearSelection();
                    this.addField(undefined, { x: mouseEvent.x, y: mouseEvent.y });
                    return;
                }
            }
        });
        this.gridStage.on('dblclick', (e: KonvaEventObject<MouseEvent>) => {
            const _targetName = e.target.name();
            const { fieldId, recordId } = getDetailByTargetName(_targetName);
            if (!this.coordinate || !recordId || !fieldId) {
                return;
            }

            const field = getRecordOrField(this.aiTable.fields, fieldId!) as Signal<AITableField>;
            const fieldType = field().type;
            if (!DBL_CLICK_EDIT_TYPE.includes(fieldType)) {
                return;
            }
            this.aiTableGridEventService.openEditByDblClick(this.aiTable, {
                container: this.containerElement(),
                coordinate: this.coordinate,
                fieldId: fieldId!,
                recordId: recordId!
            });
        });
    }

    private bindWheel() {
        if (!this.container()) {
            return;
        }
        const isWindows = isWindowsOS();
        let timer: number | null = null;
        fromEvent<WheelEvent>(this.containerElement(), 'wheel', { passive: false })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((e: WheelEvent) => {
                e.preventDefault();
                if (timer) {
                    return;
                }
                timer = requestAnimationFrame(() => {
                    const { deltaX, deltaY, shiftKey } = e;
                    const fixedDeltaY = shiftKey && isWindows ? 0 : deltaY;
                    const fixedDeltaX = shiftKey && isWindows ? deltaY : deltaX;
                    const horizontalBar = this.horizontalBarRef()?.nativeElement;
                    const verticalBar = this.verticalBarRef()?.nativeElement;
                    if (horizontalBar) {
                        horizontalBar.scrollLeft = horizontalBar.scrollLeft + fixedDeltaX;
                    }
                    if (verticalBar) {
                        verticalBar.scrollTop = verticalBar.scrollTop + fixedDeltaY;
                    }
                    timer = null;
                });
            });
    }

    bindScrollBarScroll() {
        fromEvent<WheelEvent>(this.horizontalBarRef()?.nativeElement, 'scroll', { passive: true })
            .pipe(
                map((e: any) => ({
                    scrollLeft: e.target.scrollLeft,
                    isScrolling: true
                })),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((scrollState) => {
                this.aiTable.context!.setScrollState(scrollState);
                this.resetScrolling();
            });

        fromEvent<WheelEvent>(this.verticalBarRef()?.nativeElement, 'scroll', { passive: true })
            .pipe(
                map((e: any) => ({
                    scrollTop: e.target.scrollTop,
                    isScrolling: true
                })),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((scrollState) => {
                this.aiTable.context!.setScrollState(scrollState);
                this.resetScrolling();
            });
    }

    private resetScrolling = () => {
        this.aiTable.context!.setScrollState({
            isScrolling: false
        });
    };
}
