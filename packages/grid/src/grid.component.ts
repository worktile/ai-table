import {
    afterNextRender,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    Signal,
    signal,
    viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Stage } from 'konva/lib/Stage';
import { fromEvent } from 'rxjs';
import {
    AI_TABLE_CELL,
    AI_TABLE_FIELD_ADD_BUTTON,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_FIELD_HEAD_MORE,
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
import { KoEventObject } from './renderer/ko-angular/interfaces/ko-event-object';
import { AITableStage } from './renderer/ko-angular/stage.component';
import { AITableGridEventService } from './services/event.service';
import { AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';
import { AITableGridStageOptions, AITableMouseDownType } from './types';
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
    imports: [AITableStage],
    providers: [AITableGridEventService, AITableGridFieldService, AITableGridSelectionService]
})
export class AITableGrid extends AITableGridBase implements OnInit, OnDestroy {
    timer!: number | null;

    gridStage!: Stage;

    coordinate!: Coordinate;

    resizeObserver!: ResizeObserver;

    fieldHeadHeight = AI_TABLE_FIELD_HEAD_HEIGHT;

    ADD_BUTTON_WIDTH = AI_TABLE_FIELD_ADD_BUTTON_WIDTH;

    isRenderDone = signal(false);

    containerRect = signal({ width: 0, height: 0 });

    container = viewChild<ElementRef>('container');

    verticalBarRef = viewChild<ElementRef>('verticalBar');

    horizontalBarRef = viewChild<ElementRef>('horizontalBar');

    gridLinearRows = computed(() => {
        return buildGridLinearRows(this.aiRecords());
    });

    containerElement = computed(() => {
        return this.container()?.nativeElement;
    });

    stageOptions!: AITableGridStageOptions;

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        super();

        afterNextRender(() => {
            this.setContainerRect();
            this.initGridRender();
            this.containerResizeListener();
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

    ngOnDestroy(): void {
        this.resizeObserver?.disconnect();
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
        this.stageOptions = {
            aiTable: this.aiTable,
            container: this.container()?.nativeElement!,
            coordinate: this.coordinate
        };
        this.cdr.markForCheck();
    }

    stageMousemove(e: KoEventObject<MouseEvent>) {
        if (this.timer) {
            cancelAnimationFrame(this.timer);
        }
        this.timer = requestAnimationFrame(() => {
            const targetName = e.event.target.name();
            const pos = this.gridStage?.getPointerPosition();
            if (pos == null) return;
            const { context } = this.aiTable;
            const { x, y } = pos;
            const curMousePosition = getMousePosition(x, y, this.coordinate, AITable.getVisibleFields(this.aiTable), context!, targetName);
            handleMouseStyle(curMousePosition.realTargetName, curMousePosition.areaType, this.containerElement());
            context!.setPointPosition(curMousePosition);
            this.timer = null;
        });
    }

    stageMousedown(e: KoEventObject<MouseEvent>) {
        const mouseEvent = e.event.evt;
        const _targetName = e.event.target.name();

        const { targetName, fieldId, recordId } = getDetailByTargetName(_targetName);
        switch (targetName) {
            case AI_TABLE_FIELD_HEAD:
                mouseEvent.preventDefault();
                if (!fieldId) return;
                this.aiTableGridSelectionService.selectField(fieldId);
                return;
            case AI_TABLE_CELL:
                if (!recordId || !fieldId) return;
                this.aiTableGridSelectionService.selectCell(recordId, fieldId);
                return;
            case AI_TABLE_FIELD_HEAD_MORE:
                mouseEvent.preventDefault();
                if (fieldId) {
                    const moreRect = e.event.target.getClientRect();
                    const fieldGroupRect = e.event.target.getParent()?.getParent()?.getClientRect()!;
                    const containerRect = this.containerElement().getBoundingClientRect();

                    const position = {
                        x: containerRect.x + moreRect.x,
                        y: containerRect.y + moreRect.y + moreRect.height
                    };
                    const editOriginPosition = {
                        x: containerRect.x + fieldGroupRect.x,
                        y: containerRect.y + fieldGroupRect.y + fieldGroupRect.height
                    };

                    this.aiTableGridFieldService.openFieldMenu(this.aiTable, {
                        origin: this.containerElement(),
                        fieldId: fieldId,
                        fieldMenus: this.fieldMenus,
                        position,
                        editOriginPosition
                    });
                }
                return;
            case AI_TABLE_ROW_ADD_BUTTON:
            case AI_TABLE_FIELD_ADD_BUTTON:
            case AI_TABLE_ROW_SELECT_CHECKBOX:
            case AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX:
                return;
            default:
                this.aiTableGridSelectionService.clearSelection();
        }
    }

    stageClick(e: KoEventObject<MouseEvent>) {
        const mouseEvent = e.event.evt;
        mouseEvent.preventDefault();
        const { context } = this.aiTable;
        const { targetName, rowIndex: pointRowIndex, x, y } = context!.pointPosition();
        if (mouseEvent.button !== AITableMouseDownType.Left) return;
        switch (targetName) {
            case AI_TABLE_ROW_ADD_BUTTON: {
                this.aiTableGridSelectionService.clearSelection();
                this.addRecord();
                return;
            }
            case AI_TABLE_ROW_SELECT_CHECKBOX: {
                const pointRecordId = context!.linearRows()[pointRowIndex]?._id;
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
    }

    stageDblclick(e: KoEventObject<MouseEvent>) {
        const _targetName = e.event.target.name();
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

    private bindScrollBarScroll() {
        fromEvent<WheelEvent>(this.horizontalBarRef()?.nativeElement, 'scroll', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((e) => {
                this.horizontalScroll(e);
            });

        fromEvent<WheelEvent>(this.verticalBarRef()?.nativeElement, 'scroll', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((e) => {
                this.verticalScroll(e);
            });
    }

    private resetScrolling = () => {
        this.aiTable.context!.setScrollState({
            isScrolling: false
        });
    };

    private horizontalScroll = (e: any) => {
        const { scrollLeft } = e.target;
        this.aiTable.context!.setScrollState({
            scrollLeft,
            isScrolling: true
        });
        this.resetScrolling();
    };

    private verticalScroll(e: any) {
        const { scrollTop } = e.target;
        this.aiTable.context!.setScrollState({
            scrollTop,
            isScrolling: true
        });
        this.resetScrolling();
    }

    private setContainerRect() {
        this.containerRect.set({
            width: this.container()?.nativeElement!.offsetWidth,
            height: this.container()?.nativeElement!.offsetHeight
        });
    }

    private containerResizeListener() {
        this.resizeObserver = new ResizeObserver(() => {
            const containerWidth = this.container()?.nativeElement!.offsetWidth;
            const totalWidth = this.coordinate?.totalWidth + this.ADD_BUTTON_WIDTH;
            this.setContainerRect();
            if (containerWidth >= totalWidth) {
                this.aiTable.context!.setScrollState({ scrollLeft: 0 });
                return;
            }
        });
        this.resizeObserver.observe(this.container()?.nativeElement!);
    }
}
