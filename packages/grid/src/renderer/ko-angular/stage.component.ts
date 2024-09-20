import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import Konva from 'konva';
import { StageConfig } from 'konva/lib/Stage';
import _ from 'lodash';
import { AI_TABLE_CELL, AI_TABLE_FIELD_ADD_BUTTON_WIDTH, AI_TABLE_OFFSET, AI_TABLE_ROW_HEAD_WIDTH, Colors } from '../../constants';
import { AITable } from '../../core';
import { AITableCellsOptions, AITableGridStageOptions, AITableRowType } from '../../types';
import { generateTargetName, getCellHorizontalPosition, getVisibleRangeInfo } from '../../utils';
import { createCells } from '../creations/create-cells';
import { AITableAddField } from './add-field-column.component';
import { KoCoreShape } from './components/core-shape.component';
import { KoFieldHead } from './components/field-head.component';
import { KoIcon } from './components/icon.component';
import { KoStage } from './components/stage.component';
import { AITableColumnHeads, AITableFrozenColumnHeads } from './heads.component';
import { KoEventObject } from './interfaces/ko-event-object';

@Component({
    selector: 'ai-table-stage',
    template: `
        <ko-stage
            [config]="stageConfig()"
            (onMousemove)="stageMousemove($event)"
            (onMousedown)="stageMousedown($event)"
            (onClick)="stageClick($event)"
            (onDblclick)="stageDblclick($event)"
        >
            <ko-layer>
                <!-- gridGroup -->
                <ko-group
                    [config]="{
                        clipX: 0,
                        clipY: 0,
                        clipWidth: containerWidth(),
                        clipHeight: containerHeight()
                    }"
                >
                    <!-- frozenGroup -->
                    <ko-group [config]="{ offsetY: scrollState()!.scrollTop }">
                        <ko-shape [config]="frozenCellsConfig()"></ko-shape>
                        @for (item of frozenPlaceHolderCellsConfig(); track $index) {
                            <ko-rect [config]="item"></ko-rect>
                        }
                    </ko-group>

                    <!-- commonGroup -->
                    <ko-group
                        [config]="{
                            clipX: frozenAreaWidth() + 1,
                            clipY: 0,
                            clipWidth: cellGroupClipWidth(),
                            clipHeight: containerHeight()
                        }"
                    >
                        <!-- cellsGroup -->
                        <ko-group [config]="{ offsetY: scrollState()!.scrollTop, offsetX: scrollState()!.scrollLeft }">
                            <ko-shape [config]="cellsConfig()"></ko-shape>
                        </ko-group>
                        <!-- cellHeadGroup -->
                        <ko-group [config]="{ offsetX: scrollState()!.scrollLeft }"> </ko-group>
                    </ko-group>

                    <!-- attachGroup -->
                    <ko-group
                        [config]="{
                            clipX: frozenAreaWidth() - 1,
                            clipY: coordinate()!.rowInitSize - 1,
                            clipWidth: containerWidth() - frozenAreaWidth(),
                            clipHeight: containerHeight() - coordinate()!.rowInitSize
                        }"
                    >
                        <!-- commonAttachContainerGroup -->
                        <ko-group [config]="{ offsetX: scrollState()!.scrollLeft, offsetY: scrollState()!.scrollTop }">
                            @for (item of placeHolderCellsConfig(); track $index) {
                                <ko-rect [config]="item"></ko-rect>
                            }
                        </ko-group>
                    </ko-group>

                    <!-- frozenAttachGroup -->
                    <ko-group
                        [config]="{
                            clipX: 0,
                            clipY: coordinate()!.rowInitSize - 1,
                            clipWidth: frozenAreaWidth() + 4,
                            clipHeight: containerHeight() - coordinate()!.rowInitSize
                        }"
                    >
                        <!-- frozenActiveGroup -->
                        <ko-group [config]="{ offsetY: scrollState()!.scrollTop }"></ko-group>
                    </ko-group>
                </ko-group>
            </ko-layer>
        </ko-stage>
    `,
    standalone: true,
    imports: [KoStage, KoCoreShape, AITableAddField, AITableFrozenColumnHeads, AITableColumnHeads, KoIcon, KoFieldHead],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableStage {
    options = input.required<AITableGridStageOptions>();

    onMousemove = output<KoEventObject<MouseEvent>>();
    onMousedown = output<KoEventObject<MouseEvent>>();
    onWheel = output<KoEventObject<WheelEvent>>();
    onClick = output<KoEventObject<MouseEvent>>();
    onDblclick = output<KoEventObject<MouseEvent>>();

    fields = computed(
        () => {
            return AITable.getVisibleFields(this.options().aiTable);
        },
        { equal: _.isEqual }
    );

    coordinate = computed(
        () => {
            return this.options()?.coordinate;
        },
        { equal: _.isEqual }
    );

    containerWidth = computed<number>(
        () => {
            return this.coordinate()!.containerWidth!;
        },
        { equal: _.isEqual }
    );

    containerHeight = computed<number>(
        () => {
            return this.coordinate()!.containerHeight!;
        },
        { equal: _.isEqual }
    );

    scrollState = computed(
        () => {
            return this.options()?.aiTable!.context!.scrollState();
        },
        { equal: _.isEqual }
    );

    visibleRangeInfo = computed(
        () => {
            return getVisibleRangeInfo(this.coordinate()!, this.scrollState()!);
        },
        { equal: _.isEqual }
    );

    frozenAreaWidth = computed(
        () => {
            return AI_TABLE_ROW_HEAD_WIDTH + this.coordinate()!.frozenColumnWidth!;
        },
        { equal: _.isEqual }
    );

    lastColumnWidth = computed(
        () => {
            return this.coordinate()!.getColumnWidth(this.visibleRangeInfo().columnStopIndex);
        },
        { equal: _.isEqual }
    );

    lastColumnOffset = computed(
        () => {
            return this.coordinate()!.getColumnOffset(this.visibleRangeInfo().columnStopIndex);
        },
        { equal: _.isEqual }
    );

    cellGroupClipWidth = computed(
        () => {
            return Math.min(
                this.containerWidth() - this.frozenAreaWidth(),
                AI_TABLE_FIELD_ADD_BUTTON_WIDTH +
                    this.lastColumnOffset() +
                    this.lastColumnWidth() -
                    this.scrollState()!.scrollLeft -
                    this.frozenAreaWidth()
            );
        },
        { equal: _.isEqual }
    );

    stageConfig = computed<Partial<StageConfig>>(
        () => {
            return {
                width: this.containerWidth(),
                height: this.containerHeight(),
                listening: this.scrollState()!.isScrolling ? false : true
            };
        },
        { equal: _.isEqual }
    );

    columnHeadOptions = computed(
        () => {
            const { columnStartIndex, columnStopIndex } = this.visibleRangeInfo();
            const { aiTable } = this.options();
            const { pointPosition } = aiTable.context!;
            const fields = AITable.getVisibleFields(aiTable);
            return {
                coordinate: this.coordinate(),
                columnStartIndex,
                columnStopIndex,
                fields,
                pointPosition: pointPosition(),
                aiTable
            };
        },
        { equal: _.isEqual }
    );

    /************ cells ************/
    frozenCellsConfig = computed(
        () => {
            const { aiTable, coordinate } = this.options();
            const { frozenColumnCount } = this.coordinate();
            const { rowStartIndex, rowStopIndex } = this.visibleRangeInfo();
            return {
                listening: false,
                perfectDrawEnabled: false,
                sceneFunc: (ctx: Konva.Context) =>
                    createCells({
                        ctx,
                        aiTable,
                        coordinate,
                        rowStartIndex,
                        rowStopIndex,
                        columnStartIndex: 0,
                        columnStopIndex: frozenColumnCount - 1
                    })
            };
        },
        { equal: _.isEqual }
    );

    cellsConfig = computed(
        () => {
            const { aiTable, coordinate } = this.options();
            const { frozenColumnCount } = this.coordinate();
            const { rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = this.visibleRangeInfo();
            return {
                listening: false,
                perfectDrawEnabled: false,
                sceneFunc: (ctx: Konva.Context) =>
                    createCells({
                        ctx,
                        aiTable,
                        coordinate,
                        rowStartIndex,
                        rowStopIndex,
                        columnStartIndex: Math.max(columnStartIndex, frozenColumnCount),
                        columnStopIndex
                    })
            };
        },
        { equal: _.isEqual }
    );

    /********** placeHolderCells ***********/
    frozenPlaceHolderCellsConfig = computed(
        () => {
            const { aiTable, coordinate } = this.options();
            const { rowStartIndex, rowStopIndex } = this.visibleRangeInfo();
            return this.getPlaceHolderCellsConfigs({
                aiTable,
                coordinate,
                rowStartIndex,
                rowStopIndex,
                columnStartIndex: 0,
                columnStopIndex: coordinate.frozenColumnCount - 1
            });
        },
        { equal: _.isEqual }
    );

    placeHolderCellsConfig = computed(
        () => {
            const { aiTable, coordinate } = this.options();
            const { rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = this.visibleRangeInfo();
            return this.getPlaceHolderCellsConfigs({ aiTable, coordinate, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex });
        },
        { equal: _.isEqual }
    );

    getPlaceHolderCellsConfigs(options: AITableCellsOptions) {
        const { aiTable, coordinate, columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = options;
        const { linearRows } = aiTable.context!;
        const { rowHeight, columnCount, rowCount } = coordinate;
        const visibleColumns = AITable.getVisibleFields(aiTable);

        let configs = [];
        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            // 当前列索引超出总列数范围，返回空
            if (columnIndex > columnCount - 1) {
                return [];
            }
            const field = visibleColumns[columnIndex];
            const fieldId = field._id;

            // 当前列不存在，返回空
            if (field == null) {
                return [];
            }

            // 当前列的 X 轴偏移量和列宽度
            const x = coordinate.getColumnOffset(columnIndex) + AI_TABLE_OFFSET;
            const columnWidth = coordinate.getColumnWidth(columnIndex);

            for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                // 当前行索引是否超出总行数范围，超出则退出循环
                if (rowIndex > rowCount - 1) {
                    break;
                }

                const row = linearRows()[rowIndex];
                const { _id: recordId, type } = row;
                if (type !== AITableRowType.record) {
                    continue;
                }

                // 当前行的 Y 轴偏移量，并根据列宽和列索引获取单元格的水平位置（宽度和偏移量）
                const y = coordinate.getRowOffset(rowIndex) + AI_TABLE_OFFSET;
                const { width, offset } = getCellHorizontalPosition({
                    columnWidth,
                    columnIndex,
                    columnCount
                });

                const height = rowHeight;
                configs.unshift({
                    key: `placeholder-cell-${fieldId}-${recordId}`,
                    name: generateTargetName({
                        targetName: AI_TABLE_CELL,
                        fieldId,
                        recordId
                    }),
                    x: x + offset,
                    y,
                    width,
                    height,
                    fill: Colors.transparent,
                    strokeEnabled: false,
                    hitStrokeWidth: 0,
                    transformsEnabled: 'position',
                    perfectDrawEnabled: false,
                    shadowEnabled: false
                });
            }
        }
        return configs;
    }

    stageMousemove(e: KoEventObject<MouseEvent>) {
        this.onMousemove.emit(e as KoEventObject<MouseEvent>);
    }

    stageMousedown(e: KoEventObject<MouseEvent>) {
        this.onMousedown.emit(e as KoEventObject<MouseEvent>);
    }

    stageClick(e: KoEventObject<MouseEvent>) {
        this.onClick.emit(e as KoEventObject<MouseEvent>);
    }

    stageDblclick(e: KoEventObject<MouseEvent>) {
        this.onDblclick.emit(e as KoEventObject<MouseEvent>);
    }
}
