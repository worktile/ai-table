import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    Signal,
    signal,
    untracked,
    viewChild,
    ViewContainerRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent } from 'rxjs';
import { KoEventObject } from './angular-konva';
import {
    AI_TABLE_CELL,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_ADD_BUTTON,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_FIELD_HEAD_MORE,
    AI_TABLE_FIELD_HEAD_OPACITY_LINE,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_PREVENT_CLEAR_SELECTION_CLASS,
    AI_TABLE_ROW_ADD_BUTTON,
    AI_TABLE_ROW_DRAG,
    AI_TABLE_ROW_HEAD,
    AI_TABLE_ROW_HEAD_WIDTH,
    AI_TABLE_ROW_HEIGHT,
    AI_TABLE_ROW_SELECT_CHECKBOX,
    DBL_CLICK_EDIT_TYPE,
    DEFAULT_POINT_POSITION,
    DEFAULT_SCROLL_STATE,
    IconPathMap
} from './constants';
import { Coordinate, RendererContext, AITable, defaultFieldOptions } from './core';
import { AITableGridBase } from './grid-base.component';
import { AITableRenderer } from './renderer/renderer.component';
import { AITableGridEventService } from './services/event.service';
import { AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';
import {
    AITableAreaType,
    AITableContextMenuItem,
    AITableMouseDownType,
    AITableRendererConfig,
    AITableSelectAllState,
    ScrollActionOptions
} from './types';
import {
    AITableGridI18nKey,
    buildGridLinearRows,
    getColumnIndicesSizeMap,
    getDetailByTargetName,
    getI18nTextByKey,
    handleMouseStyle,
    isCellMatchKeywords,
    isWindows,
    clearCells,
    FieldModelMap,
    isVirtualKey
} from './utils';
import { getMousePosition } from './utils/position';
import { AITableDragComponent } from './components/drag/drag.component';
import { buildClipboardData, writeToClipboard, writeToAITable, AITableActions } from './utils/clipboard';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { isNumber } from 'lodash';
import {
    AddFieldOptions,
    AddRecordOptions,
    AIRecordFieldIdPath,
    AITableField,
    AITableFieldOption,
    AITableFieldType,
    AITableViewFields,
    DragEndData,
    DragType,
    IdPath,
    UpdateFieldValueOptions
} from '@ai-table/utils';
import { ThyTooltipDirective } from 'ngx-tethys/tooltip';
import { ThyIcon } from 'ngx-tethys/icon';
import { ComponentMap } from './renderer/components/cells/cells';

@Component({
    selector: 'ai-table-grid',
    templateUrl: './grid.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid'
    },
    imports: [AITableRenderer, AITableDragComponent, ThyTooltipDirective, ThyIcon],
    providers: [AITableGridEventService, AITableGridFieldService, AITableGridSelectionService]
})
export class AITableGrid extends AITableGridBase implements OnInit, OnDestroy {
    private viewContainerRef = inject(ViewContainerRef);

    private isDragSelecting = false;

    private dragSelectionStart: AIRecordFieldIdPath | null = null;

    private notifyService = inject(ThyNotifyService);

    private isPopoverOpen = false;

    timer!: number | null;

    resizeObserver!: ResizeObserver;

    fieldHeadHeight = AI_TABLE_FIELD_HEAD_HEIGHT;

    containerRect = signal({ width: 0, height: 0 });

    frozenColumnCount = signal(1);

    hasContainerRect = computed(() => {
        return this.containerRect().width > 0 && this.containerRect().height > 0;
    });

    container = viewChild<ElementRef>('container');

    verticalBarRef = viewChild<ElementRef>('verticalBar');

    horizontalBarRef = viewChild<ElementRef>('horizontalBar');

    linearRows = computed(() => {
        return buildGridLinearRows(this.gridData().records, !this.aiReadonly());
    });

    domToolTips = computed(() => {
        const scrollTop = this.aiTable.context!.scrollState().scrollTop;
        const rowIndices = this.toolTipRowIndices();
        return rowIndices.map((rowIndex) => {
            return {
                top: rowIndex * AI_TABLE_ROW_HEIGHT - scrollTop,
                left: 0
            };
        });
    });

    toolTipRowIndices = computed(() => {
        const hiddenRows = this.aiTable.recordsWillHidden() || [];
        const toolTipRowIndices: number[] = hiddenRows.map((rowId) => {
            return this.aiTable.context?.visibleRowsIndexMap().get(rowId) || 0;
        });
        return toolTipRowIndices;
    });

    visibleColumnsIndexMap = computed(() => {
        const columns = AITable.getVisibleFields(this.aiTable);
        return new Map(columns?.map((item, index) => [item._id, index]));
    });

    fieldOptions = computed<AITableFieldOption[]>(() => {
        let allFieldOptions = defaultFieldOptions.map((fieldOption) => {
            fieldOption.name = getI18nTextByKey(this.aiTable, fieldOption.name);
            return fieldOption;
        });

        Object.entries(this.aiTable.context?.aiFieldConfig()?.customFields || {}).forEach(([fieldType, fieldConfig]) => {
            if (fieldConfig?.fieldOption) {
                allFieldOptions.push(fieldConfig.fieldOption);
            }
        });

        const fieldOptionMap = new Map<string, AITableFieldOption>(allFieldOptions.map((fieldOption) => [fieldOption.type, fieldOption]));

        const fieldOptionKeys = this.aiTable.context?.aiFieldConfig()?.fieldOptionKeys || [];
        if (fieldOptionKeys.length > 0) {
            allFieldOptions = fieldOptionKeys.map((fieldOptionKey) => fieldOptionMap.get(fieldOptionKey) as AITableFieldOption);
        }
        return allFieldOptions;
    });

    fieldOptionMap = computed<Map<string, AITableFieldOption>>(() => {
        return new Map<string, AITableFieldOption>(this.fieldOptions().map((fieldOption) => [fieldOption.type, fieldOption]));
    });

    visibleRowsIndexMap = computed(() => {
        return new Map(this.linearRows().map((row, index) => [row._id, index]));
    });

    containerElement = computed(() => {
        return this.container()!.nativeElement;
    });

    trackBy = (index: number, item: any) => {
        return item.sort_by ?? index;
    };

    rendererConfig: Signal<AITableRendererConfig> = computed(() => {
        const fields = AITable.getVisibleFields(this.aiTable);
        const coordinate = new Coordinate({
            container: this.containerElement(),
            rowHeight: AI_TABLE_FIELD_HEAD_HEIGHT,
            rowCount: this.linearRows().length,
            columnCount: fields.length,
            rowInitSize: AI_TABLE_FIELD_HEAD_HEIGHT,
            columnInitSize: this.aiTable.context!.rowHeadWidth(),
            rowIndicesSizeMap: {},
            columnIndicesSizeMap: getColumnIndicesSizeMap(this.aiTable, fields),
            frozenColumnCount: this.frozenColumnCount()
        });
        return {
            aiTable: this.aiTable,
            gridData: this.gridData(),
            container: this.containerElement(),
            coordinate: coordinate,
            containerWidth: this.containerRect().width,
            containerHeight: this.containerRect().height,
            references: this.aiReferences(),
            readonly: this.aiReadonly(),
            rowDragDisabled: this.aiRowDragDisabled(),
            actions: this.actions,
            maxFields: this.aiMaxFields(),
            maxRecords: this.aiMaxRecords()
        };
    });

    coordinate = computed(() => {
        return this.rendererConfig().coordinate;
    });

    scrollTotalHeight = computed(() => {
        return Math.max(this.coordinate().totalHeight, this.containerRect().height - this.fieldHeadHeight);
    });

    scrollbarWidth = computed(() => {
        return this.coordinate().totalWidth + AI_TABLE_FIELD_ADD_BUTTON_WIDTH;
    });

    private actions: AITableActions = {
        updateFieldValue: (data: UpdateFieldValueOptions) => {
            this.aiUpdateFieldValue.emit(data);
        },
        setField: (field: AITableField) => {
            this.aiSetField.emit(field);
        },
        addField: (data: AddFieldOptions) => {
            this.aiAddField.emit(data);
        },
        addRecord: (data: AddRecordOptions) => {
            this.addRecord(data);
        }
    };

    constructor() {
        super();

        afterNextRender(() => {
            this.setContainerRect();
            this.bindGlobalMousedown();
            this.containerResizeListener();
            this.bindWheel();
            this.bindShortcuts();
        });

        effect(() => {
            if (this.hasContainerRect() && this.horizontalBarRef() && this.verticalBarRef()) {
                this.bindScrollBarScroll();
            }
        });

        effect(() => {
            this.setKeywordsMatchedCells();
        });

        effect(() => {
            // 当新增行选中的cell,编辑后，activeCell 不在新增的行中时，根据筛选 过滤行数据,触发重新渲染
            const activeCellPath = this.aiTable.selection().activeCell;
            untracked(() => {
                if (!activeCellPath || !this.aiTable.recordsWillHidden().includes(activeCellPath[0])) {
                    if (this.aiTable.recordsWillHidden().length > 0) {
                        this.aiTable.recordsWillHidden.set([]);
                    }
                }
            });
        });

        effect(() => {
            const recordIdSet = new Set<string>(this.aiTable.records().map((item) => item._id));
            untracked(() => {
                const selectedRecords = this.aiTable.selection().selectedRecords;
                for (const selectedRecordId of selectedRecords.values()) {
                    if (!recordIdSet.has(selectedRecordId)) {
                        selectedRecords.delete(selectedRecordId);
                    }
                }
                this.aiTable.selection.update((item) => {
                    return {
                        ...item,
                        selectedRecords,
                        selectAllState: this.aiTableGridSelectionService.selectAllState()
                    };
                });
            });
        });
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initContext();
        this.initCustomField();
    }

    ngOnDestroy(): void {
        this.resizeObserver?.disconnect();
    }

    private initContext() {
        this.aiTable.context = new RendererContext({
            rowHeadWidth: computed(() => (this.aiFieldConfig()?.hiddenIndexColumn ? 0 : AI_TABLE_ROW_HEAD_WIDTH)),
            linearRows: this.linearRows,
            visibleColumnsIndexMap: this.visibleColumnsIndexMap,
            visibleRowsIndexMap: this.visibleRowsIndexMap,
            pointPosition: signal(DEFAULT_POINT_POSITION),
            scrollState: signal(DEFAULT_SCROLL_STATE),
            frozenColumnCount: this.frozenColumnCount,
            references: this.aiReferences,
            aiFieldConfig: this.aiFieldConfig,
            scrollAction: this.scrollAction,
            maxFields: this.aiMaxFields,
            maxRecords: this.aiMaxRecords,
            fieldOptions: this.fieldOptions,
            fieldOptionMap: this.fieldOptionMap
        });
    }

    private initCustomField() {
        const customFields = this.aiFieldConfig()?.customFields;
        if (customFields) {
            Object.entries(customFields).forEach(([key, customField]) => {
                if (customField?.hoverRender) {
                    ComponentMap[key] = customField.hoverRender;
                }
                if (customField?.fieldModel) {
                    FieldModelMap[key] = customField.fieldModel;
                }
                if (customField?.fieldOption?.path) {
                    IconPathMap[customField?.fieldOption.icon] = customField.fieldOption.path;
                }
            });
        }
    }

    private setKeywordsMatchedCells() {
        const keywords = this.aiKeywords();
        let matchedCells = new Set<string>();

        if (keywords) {
            const references = this.aiReferences();
            this.aiTable.records().forEach((record) => {
                this.aiTable.fields().forEach((field) => {
                    if (isCellMatchKeywords(this.aiTable, field, record._id, keywords, references)) {
                        matchedCells.add(`${record._id}:${field._id}`);
                    }
                });
            });
        }

        this.aiTable.keywordsMatchedCells.set(matchedCells);
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
                this.aiTable,
                x,
                y,
                this.coordinate(),
                AITable.getVisibleFields(this.aiTable),
                context!,
                targetName
            );
            handleMouseStyle(
                curMousePosition.realTargetName,
                curMousePosition.areaType,
                this.containerElement(),
                this.aiReadonly(),
                this.aiRowDragDisabled()
            );
            if (curMousePosition.areaType !== AITableAreaType.none) {
                context!.setPointPosition(curMousePosition);
            } else {
                this.setDefaultPointPosition();
            }
            this.timer = null;
            if (this.isDragSelecting) {
                const { fieldId, recordId } = getDetailByTargetName(curMousePosition.realTargetName);
                if (fieldId && recordId) {
                    const startCell = this.dragSelectionStart;
                    const endCell: AIRecordFieldIdPath = [recordId, fieldId];
                    if (startCell && !!startCell.length) {
                        this.aiTableGridSelectionService.selectCells(startCell, endCell);
                    }
                }
            }
        });
    }

    stageMousedown(e: KoEventObject<MouseEvent>) {
        const mouseEvent = e.event.evt;
        const _targetName = e.event.target.name();

        const { targetName, fieldId, recordId } = getDetailByTargetName(_targetName);
        if (
            mouseEvent.button === AITableMouseDownType.Right &&
            recordId &&
            fieldId &&
            (this.aiTable.selection().selectedRecords.has(recordId) || this.aiTable.selection().selectedCells.has(`${recordId}:${fieldId}`))
        ) {
            return;
        }

        switch (targetName) {
            case AI_TABLE_FIELD_HEAD:
                mouseEvent.preventDefault();
                if (!fieldId) return;
                this.aiTableGridSelectionService.selectField(fieldId);
                this.handleFieldDragStart();
                return;
            case AI_TABLE_FIELD_HEAD_OPACITY_LINE:
                mouseEvent.preventDefault();
                if (!fieldId) return;
                this.handleFieldWidthDragStart(fieldId);
                return;
            case AI_TABLE_CELL:
                if (!recordId || !fieldId) return;
                const dragSelectionStart: AIRecordFieldIdPath = [recordId, fieldId];
                this.updateDragSelectionState(true, dragSelectionStart);
                const [expandRecordId, expandFieldId] = this.aiTable.selection().expandCell || [null, null];
                if (expandRecordId !== recordId || expandFieldId !== fieldId) {
                    this.aiTableGridSelectionService.selectCells(dragSelectionStart);
                }
                return;
            case AI_TABLE_ROW_DRAG:
                if (!recordId) return;
                mouseEvent.preventDefault();
                const selectedRecords = this.aiTable.selection().selectedRecords;
                let dragRecords: string[] = [];
                if (selectedRecords.has(recordId)) {
                    dragRecords = [recordId, ...selectedRecords.values()];
                } else {
                    // 当前拖拽行不在选中行中，只拖拽当前行
                    dragRecords = [recordId];
                }
                this.handleRowDragStart(dragRecords);
                return;
            case AI_TABLE_ROW_ADD_BUTTON:
            case AI_TABLE_FIELD_ADD_BUTTON:
            case AI_TABLE_ROW_HEAD:
            case AI_TABLE_ROW_SELECT_CHECKBOX:
            case AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX:
                return;
            default:
                this.aiTableGridSelectionService.clearSelection();
        }
    }

    stageMouseup(e: KoEventObject<MouseEvent>) {
        this.updateDragSelectionState(false, null);
    }

    stageMouseleave(e: KoEventObject<MouseEvent>) {
        if (this.timer) {
            cancelAnimationFrame(this.timer);
        }
        this.timer = requestAnimationFrame(() => {
            if (this.isPopoverOpen) {
                return;
            }
            this.setDefaultPointPosition();
        });
    }

    stageContextmenu(e: KoEventObject<MouseEvent>) {
        const mouseEvent = e.event.evt;
        mouseEvent.preventDefault();

        if (this.aiReadonly()) {
            return;
        }

        const targetName = e.event.target.name();
        const { fieldId, recordId } = getDetailByTargetName(targetName);
        if (!recordId || !fieldId) {
            return;
        }

        const position = {
            x: mouseEvent.x,
            y: mouseEvent.y
        };

        const menuItems: AITableContextMenuItem[] = [];
        if (this.aiContextMenuItems()) {
            menuItems.push(...this.aiContextMenuItems()!(this.aiTable));
        }
        if (!menuItems.length || menuItems.every((item) => !!(item.hidden && item.hidden(this.aiTable, targetName, position)))) {
            return;
        }

        this.aiTableGridEventService.openContextMenu(this.aiTable, {
            origin: this.containerElement(),
            menuItems,
            position,
            targetName,
            viewContainerRef: this.viewContainerRef
        });
    }

    stageClick(e: KoEventObject<MouseEvent>) {
        const targetNameDetail = getDetailByTargetName(e.event.target.name());
        this.aiClick.emit({
            ...e,
            targetNameDetail
        });
        const mouseEvent = e.event.evt;
        mouseEvent.preventDefault();
        this.aiTableGridEventService.closeCellEditor();

        const { context } = this.aiTable;
        const targetName = targetNameDetail.targetName;
        if (mouseEvent.button !== AITableMouseDownType.Left || (targetName !== AI_TABLE_FIELD_HEAD_MORE && this.aiReadonly())) return;
        switch (targetName) {
            case AI_TABLE_ROW_ADD_BUTTON: {
                this.aiTableGridSelectionService.clearSelection();
                this.addRecord();
                break;
            }
            case AI_TABLE_ROW_SELECT_CHECKBOX: {
                const { rowIndex: pointRowIndex } = context!.pointPosition();
                const pointRecordId = context!.linearRows()[pointRowIndex]?._id;
                this.selectRecord(pointRecordId);
                break;
            }
            case AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX: {
                const isChecked = this.aiTable.selection().selectAllState === AITableSelectAllState.all;
                this.toggleSelectAll(!isChecked);
                break;
            }
            case AI_TABLE_FIELD_ADD_BUTTON: {
                this.aiTableGridSelectionService.clearSelection();
                const fieldGroupRect = e.event.target.getParent()?.getClientRect()!;
                const containerRect = this.containerElement().getBoundingClientRect();
                this.addField(this.containerElement(), {
                    x: fieldGroupRect.x + containerRect.x,
                    y: containerRect.y + fieldGroupRect.y + fieldGroupRect.height
                });
                break;
            }
            case AI_TABLE_FIELD_HEAD_MORE:
                mouseEvent.preventDefault();
                const _targetName = e.event.target.name();
                const { fieldId } = getDetailByTargetName(_targetName);
                if (fieldId) {
                    const moreRect = e.event.target.getClientRect();
                    const fieldGroupRect = e.event.target.getParent()?.getParent()?.getClientRect()!;
                    const containerRect = this.containerElement().getBoundingClientRect();

                    const position = {
                        x: containerRect.x + moreRect.x,
                        y: containerRect.y + moreRect.y + moreRect.height
                    };
                    const editFieldPosition = {
                        x: containerRect.x + fieldGroupRect.x - AI_TABLE_CELL_PADDING,
                        y: containerRect.y + fieldGroupRect.y + fieldGroupRect.height
                    };

                    const editOrigin = this.containerElement().querySelector('.konvajs-content') as HTMLElement;
                    const menuRef = this.aiTableGridFieldService.openFieldMenu(this.aiTable, {
                        fieldId: fieldId,
                        fieldMenus: this.fieldMenus(),
                        origin: this.containerElement(),
                        position,
                        editOrigin: editOrigin,
                        editFieldPosition
                    });
                    if (menuRef) {
                        menuRef.afterClosed().subscribe(() => {
                            this.isPopoverOpen = false;
                            this.setDefaultPointPosition();
                        });
                        this.isPopoverOpen = true;
                    }
                }
                break;
        }
        return;
    }

    stageDblclick(e: KoEventObject<MouseEvent>) {
        const _targetName = e.event.target.name();
        const targetNameDetail = getDetailByTargetName(_targetName);
        this.aiDbClick.emit({
            ...e,
            targetNameDetail
        });

        if (this.aiReadonly()) {
            return;
        }

        const { fieldId, recordId } = targetNameDetail;
        if (!recordId || !fieldId) {
            return;
        }
        const field = this.aiTable.fieldsMap()[fieldId];
        const fieldType = field.type;
        if (DBL_CLICK_EDIT_TYPE.includes(fieldType as AITableFieldType)) {
            setTimeout(() => {
                this.aiTableGridEventService.openCellEditor(this.aiTable, {
                    viewContainerRef: this.viewContainerRef,
                    container: this.containerElement(),
                    coordinate: this.coordinate(),
                    fieldId: fieldId!,
                    recordId: recordId!,
                    references: this.aiReferences(),
                    updateFieldValue: (value: UpdateFieldValueOptions<any>) => {
                        this.aiUpdateFieldValue.emit(value);
                    }
                });
            }, 0);
        }
    }

    private bindWheel() {
        fromEvent<WheelEvent>(this.containerElement(), 'wheel', { passive: false })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((e: WheelEvent) => {
                e.preventDefault();
                this.aiTableGridEventService.closeCellEditor();
                this.scrollAction({ deltaX: e.deltaX, deltaY: e.deltaY, shiftKey: e.shiftKey });
            });
    }

    scrollAction = (options: ScrollActionOptions) => {
        if (this.timer) {
            cancelAnimationFrame(this.timer);
        }
        this.timer = requestAnimationFrame(() => {
            const { deltaX, deltaY, shiftKey } = options;
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
            options.callback && options.callback();
            this.timer = null;
        });
    };

    private setDefaultPointPosition() {
        const { context } = this.aiTable;
        context!.setPointPosition(DEFAULT_POINT_POSITION);
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
                filter(
                    (e) =>
                        e.target instanceof Element &&
                        !this.containerElement().contains(e.target) &&
                        !e.target.closest(AI_TABLE_PREVENT_CLEAR_SELECTION_CLASS)
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.updateDragSelectionState(false, null);
                this.aiTableGridSelectionService.clearSelection();
            });
    }

    private updateDragSelectionState(isDragSelecting: boolean, dragSelectionStart: AIRecordFieldIdPath | null) {
        this.isDragSelecting = isDragSelecting;
        this.dragSelectionStart = dragSelectionStart;
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
            const totalWidth = this.coordinate().totalWidth + AI_TABLE_FIELD_ADD_BUTTON_WIDTH;
            this.setContainerRect();
            if (containerWidth >= totalWidth) {
                this.aiTable.context!.setScrollState({ scrollLeft: 0 });
                return;
            }
        });
        this.resizeObserver.observe(this.containerElement());
    }

    private bindShortcuts() {
        fromEvent<KeyboardEvent>(document, 'keydown')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(async (event: KeyboardEvent) => {
                if (this.aiReadonly()) {
                    return;
                }

                const hasSelectedCells = this.aiTable.selection().selectedCells.size > 0;
                if (!hasSelectedCells) {
                    return;
                }

                const hasEditingCell = !!this.aiTableGridEventService.getCurrentEditCell();
                if (hasEditingCell) {
                    return;
                }

                // 检查事件目标是否是输入框或文本区域
                const target = event.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                    return;
                }

                event.preventDefault();

                const isCopyOrPaste = (event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'v');
                const isDeleteOrBackspace = event.key === 'Backspace' || event.key === 'Delete';

                if (isCopyOrPaste) {
                    if (event.key === 'c') {
                        this.copyCells();
                    } else if (event.key === 'v') {
                        this.pasteCells();
                    }
                    return;
                }

                if (isDeleteOrBackspace) {
                    clearCells(this.aiTable, this.actions);
                    return;
                }

                // quick enter cell editor
                const isKeyForInput = !isVirtualKey(event);
                const activeCell = this.aiTable.selection().activeCell;
                const field = activeCell && this.aiTable.fieldsMap()[activeCell[1]];
                if (isKeyForInput && activeCell && field && field.type === AITableFieldType.text) {
                    const [recordId, fieldId] = activeCell;
                    this.aiTableGridEventService.openCellEditor(this.aiTable, {
                        viewContainerRef: this.viewContainerRef,
                        container: this.containerElement(),
                        coordinate: this.coordinate(),
                        fieldId,
                        recordId,
                        isSelectAll: true,
                        references: this.aiReferences(),
                        updateFieldValue: (value: UpdateFieldValueOptions<any>) => {
                            this.aiUpdateFieldValue.emit(value);
                        }
                    });
                }
            });
    }

    private copyCells() {
        const clipboardData = buildClipboardData(this.aiTable);
        if (clipboardData) {
            writeToClipboard(clipboardData).then(() => {
                const copiedCellsCount = this.aiTable.selection().selectedCells.size;
                const message = getI18nTextByKey(this.aiTable, AITableGridI18nKey.copiedCells).replace(
                    '{count}',
                    copiedCellsCount.toString()
                );
                this.notifyService.success(message, undefined, {
                    placement: 'bottomLeft'
                });
            });
        }
    }

    private pasteCells() {
        writeToAITable(this.aiTable, this.actions).then((result) => {
            if (result.isPasteOverMaxRecords || result.isPasteOverMaxFields) {
                return;
            }
            if (!result.isPasteSuccess) {
                this.notifyService.error(getI18nTextByKey(this.aiTable, AITableGridI18nKey.invalidPasteContent), undefined, {
                    placement: 'bottomLeft'
                });
            }
        });
    }

    private handleFieldDragStart() {
        if (!this.aiReadonly() && this.aiTableGridSelectionService.selectedFields.size > 0) {
            this.aiTableGridSelectionService.drag({
                type: DragType.field,
                sourceIds: this.aiTableGridSelectionService.selectedFields,
                scroll: this.getScrollPosition(),
                coordinate: this.coordinate()
            });
        }
    }

    private handleFieldWidthDragStart(fieldId: string) {
        if (!this.aiReadonly() && fieldId) {
            this.aiTableGridSelectionService.drag({
                type: DragType.columnWidth,
                sourceIds: new Set([fieldId]),
                scroll: this.getScrollPosition(),
                coordinate: this.coordinate()
            });
        }
    }

    private handleRowDragStart(recordIds: string[]) {
        if (!this.aiReadonly() && !this.aiRowDragDisabled() && recordIds.length > 0) {
            this.aiTableGridSelectionService.drag({
                type: DragType.record,
                sourceIds: new Set(recordIds),
                scroll: this.getScrollPosition(),
                coordinate: this.coordinate()
            });
        }
    }

    getScrollPosition() {
        const horizontalBar = this.horizontalBarRef()?.nativeElement;
        const verticalBar = this.verticalBarRef()?.nativeElement;
        let scrollLeft = horizontalBar?.scrollLeft || 0;
        let scrollTop = verticalBar?.scrollTop || 0;
        return { x: scrollLeft, y: scrollTop };
    }

    dragEnd(data: DragEndData) {
        switch (data.type) {
            case DragType.field:
                if (data.fieldsIndex && isNumber(data.targetIndex)) {
                    for (let i = 0; i < data.fieldsIndex.length; i++) {
                        this.aiMoveField.emit({
                            path: [data.fieldsIndex[i]],
                            newPath: [data.targetIndex + i]
                        });
                    }
                }
                break;
            case DragType.columnWidth:
                if (data.fieldIds && isNumber(data.width)) {
                    const fieldId = data.fieldIds.values().next().value!;
                    this.aiSetFieldWidth.emit({
                        path: [fieldId],
                        width: data.width
                    });
                }
                break;
            case DragType.record:
                if (data.recordIds && isNumber(data.targetIndex)) {
                    this.aiMoveRecords.emit({
                        recordIds: Array.from(data.recordIds).map((id) => [id] as IdPath),
                        newPath: [data.targetIndex]
                    });
                }
                return;
        }
        this.aiTableGridSelectionService.clearDrag();
    }
}
