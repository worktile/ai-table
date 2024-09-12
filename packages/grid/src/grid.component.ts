import { afterNextRender, ChangeDetectionStrategy, Component, computed, effect, OnInit, Signal, signal } from '@angular/core';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';
import {
    AI_TABLE_CELL,
    AI_TABLE_FIELD_ADD_BUTTON,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_OFFSET,
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
import { buildGridLinearRows, getCellHorizontalPosition, getColumnIndicesMap, getDetailByTargetName, getRecordOrField } from './utils';
import { getMousePosition } from './utils/position';
import { handleMouseStyle } from './utils/style';

@Component({
    selector: 'ai-table-grid',
    templateUrl: './grid.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid d-block w-100 h-100'
    },
    providers: [AITableGridEventService, AITableGridFieldService, AITableGridSelectionService]
})
export class AITableGrid extends AITableGridBase implements OnInit {
    container!: HTMLDivElement;

    timer: number | null | undefined;

    gridStage!: Stage;

    coordinate!: Coordinate;

    gridLinearRows = computed(() => {
        return buildGridLinearRows(this.aiRecords());
    });

    constructor() {
        super();

        afterNextRender(() => {
            this.container = this.elementRef.nativeElement.querySelector('.grid-view');
        });

        effect(() => {
            console.time('gridRender');
            this.initGridRender();
        });
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.aiTable.context = this.initContext();
    }

    initContext() {
        return new RendererContext({
            linearRows: this.gridLinearRows,
            pointPosition: signal(DEFAULT_POINT_POSITION),
            scrollState: signal(DEFAULT_SCROLL_STATE)
        });
    }

    initCoordinate() {
        const fields = AITable.getVisibleFields(this.aiTable);
        return new Coordinate({
            container: this.container,
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

    initGridRender() {
        this.coordinate = this.initCoordinate();
        this.gridStage = createGridStage({
            aiTable: this.aiTable,
            container: this.container,
            width: this.container.offsetWidth,
            height: this.container.offsetHeight,
            coordinate: this.coordinate
        });
        this.gridStage.draw();
        this.bindEvent();
        console.timeEnd('gridRender');
    }

    bindEvent() {
        const context = this.aiTable.context as RendererContext;
        this.gridStage.on('mousemove', (e: KonvaEventObject<MouseEvent>) => {
            if (this.timer) {
                cancelAnimationFrame(this.timer);
            }
            this.timer = requestAnimationFrame(() => {
                const targetName = e.target.name();
                const pos = this.gridStage.getPointerPosition();
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
                handleMouseStyle(curMousePosition.realTargetName, curMousePosition.areaType, this.container);
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
            const field = getRecordOrField(this.aiTable.fields, fieldId!) as Signal<AITableField>;
            const fieldType = field().type;
            if (!DBL_CLICK_EDIT_TYPE.includes(fieldType)) {
                return;
            }
            const { scrollState } = this.aiTable.context!;
            if (this.coordinate && recordId && fieldId) {
                const { rowHeight, columnCount } = this.coordinate;
                const { rowIndex, columnIndex } = AITable.getCellIndex(this.aiTable, { recordId, fieldId })!;

                const x = this.coordinate.getColumnOffset(columnIndex);
                const y = this.coordinate.getRowOffset(rowIndex) + AI_TABLE_OFFSET;
                const columnWidth = this.coordinate.getColumnWidth(columnIndex);
                const { width, offset } = getCellHorizontalPosition({
                    columnWidth,
                    columnIndex,
                    columnCount
                });
                this.aiTableGridEventService.openCanvasEdit(this.aiTable, {
                    container: this.container,
                    recordId,
                    fieldId,
                    position: {
                        x: x + offset - scrollState().scrollLeft,
                        y: y - scrollState().scrollTop,
                        width,
                        height: rowHeight
                    }
                });
            }
        });
    }
}
