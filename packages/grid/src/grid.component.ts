import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    OnDestroy,
    OnInit,
    Signal,
    signal,
    viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent } from 'rxjs';
import { KoEventObject } from './angular-konva';
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
import { AITable, Coordinate, RendererContext } from './core';
import { AITableGridBase } from './grid-base.component';
import { AITableRenderer } from './renderer/renderer.component';
import { AITableGridEventService } from './services/event.service';
import { AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';
import { AITableGridStageOptions, AITableMouseDownType } from './types';
import { buildGridLinearRows, getColumnIndicesMap, getDetailByTargetName, handleMouseStyle, isWindowsOS } from './utils';
import { getMousePosition } from './utils/position';

@Component({
    selector: 'ai-table-grid',
    templateUrl: './grid.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid'
    },
    imports: [AITableRenderer],
    providers: [AITableGridEventService, AITableGridFieldService, AITableGridSelectionService]
})
export class AITableGrid extends AITableGridBase implements OnInit, OnDestroy {
    timer!: number | null;

    resizeObserver!: ResizeObserver;

    fieldHeadHeight = AI_TABLE_FIELD_HEAD_HEIGHT;

    ADD_BUTTON_WIDTH = AI_TABLE_FIELD_ADD_BUTTON_WIDTH;

    containerRect = signal({ width: 0, height: 0 });

    hasContainerRect = computed(() => {
        return this.containerRect().width > 0 && this.containerRect().height > 0;
    });

    container = viewChild<ElementRef>('container');

    verticalBarRef = viewChild<ElementRef>('verticalBar');

    horizontalBarRef = viewChild<ElementRef>('horizontalBar');

    linearRows = computed(() => {
        return buildGridLinearRows(this.gridData().records);
    });

    visibleColumnsMap = computed(() => {
        const columns = AITable.getVisibleFields(this.aiTable);
        return new Map(columns?.map((item, index) => [item._id, index]));
    });

    visibleRowsIndexMap = computed(() => {
        return new Map(this.linearRows().map((row, index) => [row._id, index]));
    });

    containerElement = computed(() => {
        return this.container()!.nativeElement;
    });

    stageOptions: Signal<AITableGridStageOptions> = computed(() => {
        const fields = AITable.getVisibleFields(this.aiTable);
        const coordinate = new Coordinate({
            container: this.containerElement(),
            rowHeight: AI_TABLE_FIELD_HEAD_HEIGHT,
            rowCount: this.linearRows().length,
            columnCount: fields.length,
            rowInitSize: AI_TABLE_FIELD_HEAD_HEIGHT,
            columnInitSize: AI_TABLE_ROW_HEAD_WIDTH,
            rowIndicesMap: {},
            columnIndicesMap: getColumnIndicesMap(fields),
            frozenColumnCount: 1
        });
        return {
            aiTable: this.aiTable,
            container: this.containerElement(),
            coordinate: coordinate,
            containerWidth: this.containerRect().width,
            containerHeight: this.containerRect().height
        };
    });

    coordinate = computed(() => {
        return this.stageOptions().coordinate;
    });

    scrollTotalHeight = computed(() => {
        return Math.max(this.coordinate().totalHeight, this.containerRect().height - this.fieldHeadHeight);
    });

    constructor() {
        super();
        afterNextRender(() => {
            this.setContainerRect();
            this.bindGlobalMousedown();
            this.containerResizeListener();
            this.bindWheel();
        });
        effect(() => {
            if (this.hasContainerRect() && this.horizontalBarRef() && this.verticalBarRef()) {
                this.bindScrollBarScroll();
            }
        });
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initContext();
    }

    ngOnDestroy(): void {
        this.resizeObserver?.disconnect();
    }

    private initContext() {
        this.aiTable.context = new RendererContext({
            linearRows: this.linearRows,
            visibleColumnsMap: this.visibleColumnsMap,
            visibleRowsIndexMap: this.visibleRowsIndexMap,
            pointPosition: signal(DEFAULT_POINT_POSITION),
            scrollState: signal(DEFAULT_SCROLL_STATE)
        });
    }

    stageMousemove(e: KoEventObject<MouseEvent>) {
        if (this.timer) {
            cancelAnimationFrame(this.timer);
        }
        this.timer = requestAnimationFrame(() => {
            const targetName = e.event.target.name();
            const gridStage = e.event.currentTarget.getStage();
            const pos = gridStage?.getPointerPosition();
            if (pos == null) return;
            const { context } = this.aiTable;
            const { x, y } = pos;
            const curMousePosition = getMousePosition(
                x,
                y,
                this.coordinate(),
                AITable.getVisibleFields(this.aiTable),
                context!,
                targetName
            );
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
        const { targetName, rowIndex: pointRowIndex } = context!.pointPosition();
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
        if (!recordId || !fieldId) {
            return;
        }
        const field = this.aiTable.fieldsMap()[fieldId];
        const fieldType = field.type;
        if (!DBL_CLICK_EDIT_TYPE.includes(fieldType)) {
            return;
        }
        this.aiTableGridEventService.openEditByDblClick(this.aiTable, {
            container: this.containerElement(),
            coordinate: this.coordinate(),
            fieldId: fieldId!,
            recordId: recordId!
        });
    }

    private bindWheel() {
        const isWindows = isWindowsOS();
        fromEvent<WheelEvent>(this.containerElement(), 'wheel', { passive: false })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((e: WheelEvent) => {
                e.preventDefault();
                if (this.timer) {
                    cancelAnimationFrame(this.timer);
                }
                this.timer = requestAnimationFrame(() => {
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
                    this.timer = null;
                });
            });
    }

    private bindScrollBarScroll() {
        fromEvent<WheelEvent>(this.horizontalBarRef()!.nativeElement, 'scroll', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((e) => {
                this.horizontalScroll(e);
            });

        fromEvent<WheelEvent>(this.verticalBarRef()!.nativeElement, 'scroll', { passive: true })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((e) => {
                this.verticalScroll(e);
            });
    }

    private bindGlobalMousedown() {
        fromEvent<MouseEvent>(document, 'mousedown', { passive: true })
            .pipe(
                filter((e) => e.target instanceof Element && e.target.closest('.ai-table-grid-view') === null),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.aiTableGridSelectionService.clearSelection();
                this.aiTableGridFieldService.closeFieldMenu();
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
            width: this.containerElement().offsetWidth,
            height: this.containerElement().offsetHeight
        });
    }

    private containerResizeListener() {
        this.resizeObserver = new ResizeObserver(() => {
            const containerWidth = this.containerElement().offsetWidth;
            const totalWidth = this.coordinate().totalWidth + this.ADD_BUTTON_WIDTH;
            this.setContainerRect();
            if (containerWidth >= totalWidth) {
                this.aiTable.context!.setScrollState({ scrollLeft: 0 });
                return;
            }
        });
        this.resizeObserver.observe(this.containerElement());
    }
}
