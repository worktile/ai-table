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
    AI_TABLE_AUTO_SCROLL_BOTTOM_THRESHOLD,
    AI_TABLE_AUTO_SCROLL_LEFT_THRESHOLD,
    AI_TABLE_AUTO_SCROLL_RIGHT_THRESHOLD,
    AI_TABLE_AUTO_SCROLL_TOP_THRESHOLD,
    AI_TABLE_CELL,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_ADD_BUTTON,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_FIELD_HEAD_MORE,
    AI_TABLE_FIELD_HEAD_OPACITY_LINE,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT,
    AI_TABLE_FILL_HANDLE,
    AI_TABLE_PREVENT_CLEAR_SELECTION_CLASS,
    AI_TABLE_ROW_ADD_BUTTON,
    AI_TABLE_ROW_DRAG,
    AI_TABLE_ROW_GROUP_COLLAPSE_BUTTON,
    AI_TABLE_ROW_HEAD,
    AI_TABLE_ROW_HEAD_WIDTH,
    AI_TABLE_ROW_HEAD_WIDTH_AND_DRAG_ICON_WIDTH,
    AI_TABLE_ROW_HEIGHT,
    AI_TABLE_ROW_SELECT_CHECKBOX,
    AI_TABLE_SCROLL_BAR_SIZE,
    DBL_CLICK_EDIT_TYPE,
    DEFAULT_POINT_POSITION,
    DEFAULT_SCROLL_STATE,
    IconPathMap
} from './constants';
import { Coordinate, RendererContext, AITable, AITableDragState, getDefaultFieldOptions } from './core';
import { AITableGridBase } from './grid-base.component';
import { AITableRenderer } from './renderer/renderer.component';
import { AITableGridEventService } from './services/event.service';
import { AITableGridFieldService } from './services/field.service';
import {
    AITableAreaType,
    AITableContextMenuItem,
    AITableLinearRowGroup,
    AITableMouseDownType,
    AITableRendererConfig,
    AITableRowType,
    AITableSelectAllState,
    IndicesMap,
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
    isVirtualKey,
    setMouseStyle,
    dragFillHighlightArea,
    performFill,
    AITableDragFillState,
    expandCell,
    selectCells,
    selectField,
    clearSelection,
    closeEditingCell,
    closeExpendCell,
    clearCoverCell,
    setActiveCell,
    setSelection,
    setExpandCellInfo,
    getVisibleRangeInfo
} from './utils';
import { getMousePosition } from './utils/position';
import { AITableDragComponent } from './components/drag/drag.component';
import { buildClipboardData, writeToClipboard, writeToAITable, AITableActions } from './utils/clipboard';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { isNumber } from 'lodash';
import {
    AddFieldOptions,
    AddRecordOptions,
    AI_TABLE_MIN_FROZEN_COLUMN_COUNT,
    AIRecordFieldIdPath,
    AITableField,
    AITableFieldOption,
    AITableFieldType,
    DragEndData,
    DragType,
    IdPath,
    SetFieldStatTypeOptions,
    UpdateFieldValueOptions
} from '@ai-table/utils';
import { ThyTooltipDirective } from 'ngx-tethys/tooltip';
import { ThyIcon } from 'ngx-tethys/icon';
import { ComponentMap } from './renderer/components/cells/cells';
import { AITableScrollControllerService } from './services/scroll-controller.service';
import _ from 'lodash';

@Component({
    selector: 'ai-table-grid',
    templateUrl: './grid.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid'
    },
    imports: [AITableRenderer, AITableDragComponent, ThyTooltipDirective, ThyIcon],
    providers: [AITableGridEventService, AITableGridFieldService, AITableScrollControllerService]
})
export class AITableGrid extends AITableGridBase implements OnInit, OnDestroy {
    private viewContainerRef = inject(ViewContainerRef);

    private isDragSelectionAutoScrolling = false;

    private dragSelectState: {
        isDragging: boolean;
        startCell: AIRecordFieldIdPath | null;
    } = {
        isDragging: false,
        startCell: null
    };

    private dragFillState: AITableDragFillState = {
        isDragging: false,
        activeCell: null,
        sourceCells: new Set<string>()
    };

    private notifyService = inject(ThyNotifyService);

    private scrollControllerService = inject(AITableScrollControllerService);

    private isPopoverOpen = false;

    timer!: number | null;

    resizeObserver!: ResizeObserver;

    fieldHeadHeight = AI_TABLE_FIELD_HEAD_HEIGHT;

    containerRect = signal({ width: 0, height: 0 });

    frozenColumnCount = computed(() => {
        const containerWidth = this.containerRect().width;

        const aiFrozenColumnCountFn = this.aiFrozenColumnCountFn();
        if (aiFrozenColumnCountFn) {
            return aiFrozenColumnCountFn(containerWidth);
        }

        return AI_TABLE_MIN_FROZEN_COLUMN_COUNT;
    });

    hasContainerRect = computed(() => {
        return this.containerRect().width > 0 && this.containerRect().height > 0;
    });

    container = viewChild<ElementRef>('container');

    verticalBarRef = viewChild<ElementRef>('verticalBar');

    horizontalBarRef = viewChild<ElementRef>('horizontalBar');

    linearRows = computed(() => {
        return buildGridLinearRows(this.gridData().records, !this.aiReadonly(), this.aiTable, this.aiBuildGroupLinearRowsFn?.());
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
        let allFieldOptions = getDefaultFieldOptions().map((fieldOption) => {
            const name = getI18nTextByKey(this.aiTable, fieldOption.name);
            return { ...fieldOption, name };
        });

        Object.entries(this.aiTable.context?.aiFieldConfig()?.customFields || {}).forEach(([fieldType, fieldConfig]) => {
            if (fieldConfig?.fieldOption) {
                allFieldOptions.push(fieldConfig.fieldOption);
            }
        });

        const filterFieldOptions = this.aiTable.context?.aiFieldConfig()?.filterFieldOptions;
        if (_.isFunction(filterFieldOptions)) {
            allFieldOptions = filterFieldOptions(allFieldOptions);
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
            rowIndicesSizeMap: this.rowIndicesMap(),
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
            actions: this.actions,
            maxFields: this.aiMaxFields(),
            maxRecords: this.aiMaxRecords(),
            maxSelectOptions: this.aiMaxSelectOptions()
        };
    });

    coordinate = computed(() => {
        return this.rendererConfig().coordinate;
    });

    scrollState = computed(() => {
        return this.aiTable!.context!.scrollState();
    });

    scrollTotalHeight = computed(() => {
        return Math.max(this.coordinate().totalHeight, this.containerRect().height - this.fieldHeadHeight);
    });

    scrollbarWidth = computed(() => {
        return this.coordinate().totalWidth + AI_TABLE_FIELD_ADD_BUTTON_WIDTH;
    });

    i18nTexts = computed(() => {
        this.aiGetI18nTextByKey();
        return {
            rowAddFilterTooltip: getI18nTextByKey(this.aiTable, AITableGridI18nKey.rowAddFilterTooltip)
        };
    });
    // rowAddFilterTooltip = getI18nTextByKey(this.aiTable, AITableGridI18nKey.rowAddFilterTooltip);

    rowIndicesMap = computed(() => {
        const rowIndicesMap: IndicesMap = {};
        this.linearRows().forEach((row, index) => {
            if (row.type === AITableRowType.blank) {
                rowIndicesMap[index] = 0;
            }
        });
        return rowIndicesMap;
    });

    private actions: AITableActions = {
        updateFieldValues: (data: UpdateFieldValueOptions[]) => {
            this.aiUpdateFieldValues.emit(data);
        },
        setField: (field: AITableField) => {
            this.aiSetField.emit(field);
        },
        setFieldStatType: (data: SetFieldStatTypeOptions) => {
            this.aiSetFieldStatType.emit(data);
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
            if (this.aiKeywords() && this.aiTable.keywordsMatchedCellIndex() > -1) {
                untracked(() => {
                    this.scrollToMatchedCell();
                });
            }
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
                        selectedRecords
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
            containerRect: this.containerRect,
            rowHeadWidth: computed(() => {
                const aiFieldConfig = this.aiFieldConfig();
                let width = AI_TABLE_ROW_HEAD_WIDTH_AND_DRAG_ICON_WIDTH;
                if (aiFieldConfig?.hiddenRowDrag || this.aiReadonly()) {
                    width = AI_TABLE_ROW_HEAD_WIDTH;
                }
                return aiFieldConfig?.hiddenIndexColumn ? 0 : width;
            }),
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
            maxSelectOptions: this.aiMaxSelectOptions,
            fieldOptions: this.fieldOptions,
            fieldOptionMap: this.fieldOptionMap,
            readonly: this.aiReadonly
        });
    }

    private initCustomField() {
        const customFields = this.aiFieldConfig()?.customFields;
        if (customFields) {
            Object.entries(customFields).forEach(([key, customField]) => {
                if (customField?.coverRender) {
                    ComponentMap[key] = customField.coverRender;
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

    private scrollToMatchedCell() {
        const index = this.aiTable.keywordsMatchedCellIndex();
        if (index < 0) {
            return;
        }
        const matchCell = Array.from(this.aiTable.keywordsMatchedCells())[index];
        if (!matchCell) {
            return;
        }
        const matchCellPath: AIRecordFieldIdPath = matchCell.split(':') as AIRecordFieldIdPath;
        const { isCellCanFullRender, offsetY, offsetX } = this.coordinate().getCellIsFullRenderInfo(this.aiTable, matchCellPath);
        setActiveCell(this.aiTable, matchCellPath);
        if (!isCellCanFullRender) {
            this.scrollAction({
                deltaX: offsetX,
                deltaY: offsetY,
                shiftKey: false
            });
        }
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
            handleMouseStyle(curMousePosition.realTargetName, curMousePosition.areaType, this.containerElement(), this.aiReadonly());
            if (curMousePosition.areaType !== AITableAreaType.none) {
                context!.setPointPosition(curMousePosition);
            } else {
                this.setDefaultPointPosition();
            }
            this.timer = null;

            if (this.dragSelectState.isDragging || this.dragFillState.isDragging) {
                const { fieldId, recordId } = getDetailByTargetName(curMousePosition.realTargetName);
                if (fieldId && recordId) {
                    let startCell: AIRecordFieldIdPath;
                    let endCell: AIRecordFieldIdPath;
                    let activeCell: AIRecordFieldIdPath | null = null;
                    if (this.dragFillState.isDragging) {
                        setMouseStyle('crosshair', this.containerElement());
                        const { highlightStartCell, highlightEndCell } = dragFillHighlightArea(
                            this.aiTable,
                            this.dragFillState.sourceCells,
                            recordId
                        );
                        activeCell = this.dragFillState.activeCell;
                        startCell = highlightStartCell;
                        endCell = highlightEndCell;
                    } else {
                        startCell = this.dragSelectState.startCell!;
                        endCell = [recordId, fieldId];
                    }
                    if (startCell && !!startCell.length) {
                        selectCells(this.aiTable, startCell, endCell, activeCell);
                        this.scrollViewToCell(pos, startCell, endCell, this.coordinate(), this.horizontalBarRef(), this.verticalBarRef());
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
                selectField(this.aiTable, fieldId);
                this.handleFieldDragStart();
                return;
            case AI_TABLE_FIELD_HEAD_OPACITY_LINE:
                mouseEvent.preventDefault();
                if (!fieldId) return;
                this.handleFieldWidthDragStart(fieldId);
                return;
            case AI_TABLE_CELL:
                if (!recordId || !fieldId) return;
                const startCell: AIRecordFieldIdPath = [recordId, fieldId];
                this.updateDragSelectState(true, startCell);
                const [expandRecordId, expandFieldId] = this.aiTable.expendCell()?.path || [null, null];
                if (expandRecordId !== recordId || expandFieldId !== fieldId) {
                    const field = this.aiTable.fieldsMap()[fieldId];
                    closeEditingCell(this.aiTable);
                    selectCells(this.aiTable, startCell);
                    closeExpendCell(this.aiTable);
                    if (field.type === AITableFieldType.text) {
                        expandCell(this.aiTable, [recordId, fieldId]);
                    }
                }
                return;
            case AI_TABLE_FILL_HANDLE:
                if (!recordId || !fieldId) return;
                this.updateDragFillState({
                    isDragging: true,
                    activeCell: this.aiTable.selection().activeCell,
                    sourceCells: this.aiTable.selection().selectedCells
                });
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
                clearCoverCell(this.aiTable);
        }
    }

    stageMouseup(e: KoEventObject<MouseEvent>) {
        this.updateDragSelectState(false, null);

        if (this.dragFillState.isDragging) {
            this.performFill(e);
        }
    }

    private performFill(e: KoEventObject<MouseEvent>) {
        const targetName = e.event.target.name();
        const gridStage = e.event.currentTarget.getStage();
        const pos = gridStage?.getPointerPosition();
        if (pos == null) {
            this.updateDragFillState({ isDragging: false, activeCell: null, sourceCells: new Set<string>() });
            return;
        }
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
        const { recordId } = getDetailByTargetName(curMousePosition.realTargetName);
        if (recordId) {
            performFill(this.aiTable, this.dragFillState.sourceCells, recordId, this.actions);
        }
        this.updateDragFillState({ isDragging: false, activeCell: null, sourceCells: new Set<string>() });
    }

    stageMouseleave(e: KoEventObject<MouseEvent>) {
        if (!this.isDragSelectionAutoScrolling) {
            this.updateDragSelectState(false, null);
        }
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

    stageWheel(e: KoEventObject<WheelEvent>) {
        e.event.evt.preventDefault();
        this.aiTableGridEventService.closeCellEditor();
        this.scrollAction({ deltaX: e.event.evt.deltaX, deltaY: e.event.evt.deltaY, shiftKey: e.event.evt.shiftKey });
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
                clearCoverCell(this.aiTable);
                this.addRecord();
                const { isCanFullRender, offsetY } = this.coordinate().getAddRowButtonIsFullRenderInfo(this.aiTable);
                if (!isCanFullRender) {
                    this.scrollAction({
                        deltaX: 0,
                        deltaY: offsetY,
                        shiftKey: false
                    });
                }
                break;
            }
            case AI_TABLE_ROW_SELECT_CHECKBOX: {
                const { rowIndex: pointRowIndex } = context!.pointPosition();
                const pointRecordId = context!.linearRows()[pointRowIndex]?._id;
                this.toggleSelectRecord(pointRecordId);
                break;
            }
            case AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX: {
                const isChecked = this.aiTable.selection().selectedRecords.size === this.aiTable.records().length;
                this.toggleSelectAll(!isChecked);
                break;
            }
            case AI_TABLE_FIELD_ADD_BUTTON: {
                clearCoverCell(this.aiTable);
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
            case AI_TABLE_ROW_GROUP_COLLAPSE_BUTTON: {
                const groupId = targetNameDetail.source;
                if (groupId) {
                    this.aiRowGroupCollapseClick.emit(groupId!);
                }
                break;
            }
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
                    updateFieldValues: (value: UpdateFieldValueOptions[]) => {
                        this.aiUpdateFieldValues.emit(value);
                    }
                });
            }, 0);
        }
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
                filter((e) => {
                    // 检查点击事件的目标元素是否在 container 内
                    const isInContainer = e.target instanceof Element && this.containerElement().contains(e.target);

                    // 检查点击事件的目标元素是否在 prevent-clear-selection 元素内
                    const isInPreventClearSelection =
                        e.target instanceof Element && e.target.closest(AI_TABLE_PREVENT_CLEAR_SELECTION_CLASS);

                    // 检查点击事件的目标元素是否在 popover 弹窗内
                    const isInPopover = e.target instanceof Element && e.target.closest('.cdk-overlay-container');

                    return e.target instanceof Element && !isInContainer && !isInPreventClearSelection && !isInPopover;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.updateDragSelectState(false, null);
                clearCoverCell(this.aiTable);
            });
    }

    private updateDragSelectState(isDragging: boolean, startCell: AIRecordFieldIdPath | null) {
        this.dragSelectState = {
            isDragging: isDragging,
            startCell: startCell
        };
    }

    private updateDragFillState(dragFillState: AITableDragFillState) {
        this.dragFillState = dragFillState;
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

    private getNextCell(currentCell: AIRecordFieldIdPath, event: KeyboardEvent) {
        const { rowIndex, columnIndex } = AITable.getCellIndex(this.aiTable, currentCell) || {};
        let nextCellPath: AIRecordFieldIdPath | null = null;
        if (event.key === 'ArrowUp' && rowIndex) {
            nextCellPath = [this.aiTable.gridData().records[rowIndex - 1]._id, currentCell[1]];
        }
        if (event.key === 'ArrowDown' && rowIndex! < this.gridData().records.length - 1) {
            nextCellPath = [this.aiTable.gridData().records[rowIndex! + 1]._id, currentCell[1]];
        }
        if (event.key === 'ArrowLeft' && columnIndex) {
            nextCellPath = [currentCell[0], this.aiTable.gridData().fields[columnIndex - 1]._id];
        }
        if (event.key === 'ArrowRight' && columnIndex! < this.aiTable.gridData().fields.length - 1) {
            nextCellPath = [currentCell[0], this.aiTable.gridData().fields[columnIndex! + 1]._id];
        }
        return nextCellPath;
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

                const editingCell = this.aiTable.editingCell();
                if (editingCell && editingCell.path) {
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

                const isDirectionKey =
                    event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight';

                const isShiftDirectionKey =
                    event.shiftKey &&
                    (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight');

                if (isDirectionKey) {
                    let endCell = this.aiTable.selection().activeCell;
                    if (isShiftDirectionKey) {
                        endCell = this.aiTable.selection().selectedEndCell || endCell;
                    }
                    if (endCell) {
                        const nextCellPath = this.getNextCell(endCell, event);
                        if (nextCellPath) {
                            const newField = this.aiTable.fieldsMap()[nextCellPath[1]];
                            if (isShiftDirectionKey) {
                                closeExpendCell(this.aiTable);
                                selectCells(this.aiTable, this.aiTable.selection().activeCell!, nextCellPath!);
                            } else {
                                clearCoverCell(this.aiTable);
                                if (newField.type === AITableFieldType.text) {
                                    setExpandCellInfo(this.aiTable, {
                                        path: nextCellPath
                                    });
                                }
                                setSelection(this.aiTable, {
                                    selectedCells: new Set([nextCellPath.join(':')]),
                                    activeCell: nextCellPath
                                });
                            }

                            const cellIsFullRenderInfo = this.coordinate().getCellIsFullRenderInfo(this.aiTable, nextCellPath);
                            if (cellIsFullRenderInfo.offsetY !== 0 || cellIsFullRenderInfo.offsetX !== 0) {
                                this.scrollAction({
                                    deltaX: cellIsFullRenderInfo.offsetX,
                                    deltaY: cellIsFullRenderInfo.offsetY,
                                    shiftKey: false
                                });
                            }
                        }
                    }

                    return;
                }

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
                        updateFieldValues: (value: UpdateFieldValueOptions[]) => {
                            this.aiUpdateFieldValues.emit(value);
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
        if (!this.aiReadonly() && this.aiTable.selection().selectedFields.size > 0) {
            this.setDragState({
                type: DragType.field,
                sourceIds: this.aiTable.selection().selectedFields,
                coordinate: this.coordinate()
            });
        }
    }

    private handleFieldWidthDragStart(fieldId: string) {
        if (!this.aiReadonly() && fieldId) {
            this.setDragState({
                type: DragType.columnWidth,
                sourceIds: new Set([fieldId]),
                coordinate: this.coordinate()
            });
        }
    }

    private handleRowDragStart(recordIds: string[]) {
        if (!this.aiReadonly() && recordIds.length > 0) {
            this.setDragState({
                type: DragType.record,
                sourceIds: new Set(recordIds),
                coordinate: this.coordinate()
            });
        }
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
                        newPath: [data.targetIndex],
                        isGroup: data.isGroup
                    });
                }
                return;
        }

        this.setDragState({
            type: DragType.none,
            sourceIds: new Set()
        });
    }

    setDragState(config: AITableDragState) {
        this.aiTable.dragState!.set(config);
    }

    scrollViewToCell(
        position: { x: number; y: number },
        startCell: AIRecordFieldIdPath,
        endCell: AIRecordFieldIdPath,
        coordinate: Coordinate,
        horizontalBarRef?: ElementRef<HTMLElement>,
        verticalBarRef?: ElementRef<HTMLElement>
    ) {
        const [, startFieldId] = startCell;
        const [endRecordId, endFieldId] = endCell;

        const startColIndex = this.aiTable.context!.visibleColumnsIndexMap().get(startFieldId)!;
        const endRowIndex = this.aiTable.context!.visibleRowsIndexMap().get(endRecordId)!;
        const endColIndex = this.aiTable.context!.visibleColumnsIndexMap().get(endFieldId)!;
        const isSelectionOnlyOnFrozenColumn = startColIndex === 0 && endColIndex === 0;

        const endCellTop = coordinate.getRowOffset(endRowIndex);
        const endCellLeft = coordinate.getColumnOffset(endColIndex);

        const scrollState = this.aiTable.context!.scrollState();
        const gridData = this.aiTable.gridData();

        const containerRect = coordinate.container.getBoundingClientRect();

        this.scrollControllerService.scroll({
            container: containerRect,
            target: position,
            direction: isSelectionOnlyOnFrozenColumn || this.dragFillState.isDragging ? 'vertical' : 'both',
            scrollableElement: {
                horizontalElement: horizontalBarRef?.nativeElement,
                verticalElement: verticalBarRef?.nativeElement
            },
            frozenArea: {
                top: AI_TABLE_FIELD_HEAD_HEIGHT,
                left: coordinate.getColumnWidth(0) + this.aiTable.context!.rowHeadWidth(),
                bottom: containerRect.height - AI_TABLE_SCROLL_BAR_SIZE - AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT,
                right: containerRect.width - AI_TABLE_SCROLL_BAR_SIZE
            },
            edgeThreshold: {
                left: AI_TABLE_AUTO_SCROLL_LEFT_THRESHOLD,
                top: AI_TABLE_AUTO_SCROLL_TOP_THRESHOLD,
                right: AI_TABLE_SCROLL_BAR_SIZE + AI_TABLE_AUTO_SCROLL_RIGHT_THRESHOLD,
                bottom: AI_TABLE_AUTO_SCROLL_BOTTOM_THRESHOLD
            },
            onScrollChange: (position, isAutoScrolling) => {
                this.isDragSelectionAutoScrolling = isAutoScrolling;
                if (isAutoScrolling) {
                    const scrollLeft = position.x - scrollState.scrollLeft;
                    const scrollTop = position.y - scrollState.scrollTop;
                    const nextCellIndex = coordinate.getColumnStartIndex(endCellLeft + scrollLeft);
                    const nextRowIndex = coordinate.getRowStartIndex(endCellTop + scrollTop);
                    const isHorizontalScroll = scrollLeft !== 0;
                    // 向左滚动，单元格向后退一格，防止选区进入冻结列
                    const nextField = gridData.fields[!isHorizontalScroll || scrollLeft > 0 ? nextCellIndex : nextCellIndex + 1];
                    const nextRecord = gridData.records[nextRowIndex];

                    if (nextField && nextRecord) {
                        let newStartCell: AIRecordFieldIdPath | null = null;
                        let newEndCell: AIRecordFieldIdPath | null = null;
                        let newActiveCell: AIRecordFieldIdPath | null = null;

                        if (this.dragFillState.isDragging) {
                            const { highlightStartCell, highlightEndCell } = dragFillHighlightArea(
                                this.aiTable,
                                this.dragFillState.sourceCells,
                                nextRecord._id
                            );
                            newStartCell = highlightStartCell;
                            newEndCell = highlightEndCell;
                            newActiveCell = this.dragFillState.activeCell;
                        } else {
                            newStartCell = [startCell[0], startCell[1]];
                            newEndCell = [nextRecord._id, nextField._id];
                            newActiveCell = null;
                        }

                        selectCells(this.aiTable, newStartCell, newEndCell, newActiveCell);
                    }
                }
            },
            onAutoScrollEnd: () => {
                this.isDragSelectionAutoScrolling = false;
                this.updateDragSelectState(false, null);
            }
        });
    }
}
