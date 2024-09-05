import { afterNextRender, ChangeDetectionStrategy, Component, computed, effect, OnInit, signal } from '@angular/core';
import { AITableGridBase } from './grid-base.component';
import { createGridStage } from './grid-renderer/create-grid-stage';
import { AITableGridEventService } from './services/event.service';
import { AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';
import { buildGridLinearRows, getColumnIndicesMap, getDetailByTargetName } from './utils';
import { AITable, Context, Coordinate } from './core';
import {
    AI_TABLE_FIELD_ADD_BUTTON,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_FIELD_HEAD_MORE,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_ROW_ADD_BUTTON,
    AI_TABLE_ROW_HEAD_WIDTH,
    AI_TABLE_ROW_SELECT_CHECKBOX,
    DEFAULT_POINT_POSITION,
    DEFAULT_SCROLL_STATE
} from './constants';
import { Stage } from 'konva/lib/Stage';
import { getMousePosition } from './utils/position';
import { handleMouseStyle } from './utils/style';
import { KonvaEventObject } from 'konva/lib/Node';
import { AITableMouseDownType } from './types';

@Component({
    selector: 'ai-table-grid',
    template: '<div class="table-grid-container d-block w-100 h-100"></div>',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid d-block w-100 h-100'
    },
    imports: [],
    providers: [AITableGridEventService, AITableGridFieldService, AITableGridSelectionService]
})
export class AITableGrid extends AITableGridBase implements OnInit {
    context!: Context;

    container!: HTMLDivElement;

    timer: number | null | undefined;

    gridStage!: Stage;

    coordinate!: Coordinate;

    constructor() {
        super();

        afterNextRender(() => {
            this.container = this.elementRef.nativeElement.querySelector('.table-grid-container');
            this.initGridRender();
        });

        effect(() => {
            this.initGridRender();
        });
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.context = this.initContext();
    }

    gridLinearRows = computed(() => {
        return buildGridLinearRows(this.aiRecords());
    });

    initContext() {
        return new Context({
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
            rowCount: this.context.linearRows().length,
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
            context: this.context,
            instance: this.coordinate
        });
        this.gridStage.draw();
        this.bindEvent();
    }

    bindEvent() {
        this.gridStage.on('mousemove', (e: KonvaEventObject<MouseEvent>) => {
            if (this.timer) return;
            this.timer = window.requestAnimationFrame(() => {
                const targetName = e.target.name();
                const pos = this.gridStage.getPointerPosition();
                if (pos == null) return;
                const { x, y } = pos;
                const curMousePosition = getMousePosition(
                    x,
                    y,
                    this.coordinate,
                    AITable.getVisibleFields(this.aiTable),
                    this.context,
                    targetName
                );
                handleMouseStyle(curMousePosition.realTargetName, curMousePosition.realAreaType, this.container);
                this.context.setPointPosition(curMousePosition);
                this.timer = null;
            });
        });
        this.gridStage.on('mousedown', (e: KonvaEventObject<MouseEvent>) => {
            const mouseEvent = e.evt;
            const _targetName = e.target.name();
            const { targetName, fieldId, recordId } = getDetailByTargetName(_targetName);
            switch (targetName) {
                case AI_TABLE_FIELD_HEAD_MORE:
                case AI_TABLE_FIELD_HEAD: {
                    mouseEvent.preventDefault();
                    if (!fieldId) return;
                    return this.aiTableGridSelectionService.selectField(fieldId);
                }
                //         case AI_TABLE_CELL: {
                //             if (!recordId || !fieldId) return;
                //             return this.aiTableGridSelectionService.selectCell(recordId, fieldId);
                //         }
            }
        });
        this.gridStage.on('click', (e: KonvaEventObject<MouseEvent>) => {
            const mouseEvent = e.evt;
            mouseEvent.preventDefault();
            const { targetName, rowIndex: pointRowIndex, x, y } = this.context.pointPosition();
            if (mouseEvent.button !== AITableMouseDownType.Left) return;
            switch (targetName) {
                case AI_TABLE_ROW_ADD_BUTTON: {
                    return this.addRecord();
                }
                case AI_TABLE_ROW_SELECT_CHECKBOX: {
                    const pointRecordId = this.context.linearRows()[pointRowIndex]?._id;
                    return this.selectRecord(pointRecordId);
                }
                case AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX: {
                    const isChecked = this.aiTable.selection().selectedRecords.size === this.aiTable.records().length;
                    return this.toggleSelectAll(!isChecked);
                }
                case AI_TABLE_FIELD_ADD_BUTTON: {
                    return this.addField(undefined, { x: mouseEvent.x, y: mouseEvent.y });
                }
            }
        });
    }
}
