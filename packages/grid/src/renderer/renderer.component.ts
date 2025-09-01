import { AfterViewInit, ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import Konva from 'konva';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer, KoEventObject, KoShape, KoStage } from '../angular-konva';
import { AITable } from '../core';
import {
    AITableBackgroundConfig,
    AITableCellsConfig,
    AITableFieldStatsConfig,
    AITableFillHandleConfig,
    AITableRendererConfig
} from '../types';
import { getVisibleRangeInfo } from '../utils';
import {
    AITableAddField,
    AITableBackground,
    AITableCells,
    AITableColumnHeads,
    AITableFrozenCells,
    AITableFrozenColumnHeads,
    AITableFrozenGroups,
    AITableShadow,
    AITableFrozenPlaceholderCells,
    AITableGroups,
    AITableHoverRowHeads,
    AITableOtherRows,
    AITablePlaceholderCells
} from './components';
import { createActiveCellBorder } from './creations/create-active-cell-border';
import { AITableFillHandle } from './components/fill-handle.component';
import { AITableCoverCellEntry } from './components/cover-cell.component';
import { AITableFieldStats } from './components/field-stat/stats.component';
import {
    AI_TABLE_CELL_LINE_BORDER,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT,
    AI_TABLE_OFFSET,
    AI_TABLE_SHADOW_DEFAULT_WIDTH,
    Colors
} from '../constants';
import { NodeConfig } from 'konva/lib/Node';

Konva.pixelRatio = 2;

@Component({
    selector: 'ai-table-renderer',
    templateUrl: './renderer.component.html',
    imports: [
        KoContainer,
        KoStage,
        KoShape,
        AITableColumnHeads,
        AITableFrozenColumnHeads,
        AITableCells,
        AITableFrozenCells,
        AITableFrozenPlaceholderCells,
        AITableCoverCellEntry,
        AITablePlaceholderCells,
        AITableAddField,
        AITableHoverRowHeads,
        AITableOtherRows,
        AITableFillHandle,
        AITableFieldStats,
        AITableBackground,
        AITableFrozenGroups,
        AITableGroups,
        AITableShadow,
        AITableFrozenGroups
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableRenderer {
    config = input.required<AITableRendererConfig>();

    koMousemove = output<KoEventObject<MouseEvent>>();

    koMousedown = output<KoEventObject<MouseEvent>>();

    koMouseup = output<KoEventObject<MouseEvent>>();

    koContextmenu = output<KoEventObject<MouseEvent>>();

    koWheel = output<KoEventObject<WheelEvent>>();

    koClick = output<KoEventObject<MouseEvent>>();

    koDblclick = output<KoEventObject<MouseEvent>>();

    koMouseleave = output<KoEventObject<MouseEvent>>();

    onScrollPosition = output<{ scrollX: number; scrollY: number }>();

    isHoverStatContainer = signal(false);

    fields = computed(() => {
        return AITable.getVisibleFields(this.config().aiTable);
    });

    readonly = computed(() => {
        return this.config()?.readonly;
    });

    hiddenIndexColumn = computed(() => {
        return this.config()?.aiTable.context?.aiFieldConfig()?.hiddenIndexColumn;
    });

    coordinate = computed(() => {
        return this.config()?.coordinate;
    });

    containerWidth = computed<number>(() => {
        return this.config().containerWidth;
    });

    containerHeight = computed<number>(() => {
        return this.config().containerHeight;
    });

    gridContainerHeight = computed<number>(() => {
        return this.containerHeight() - AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT;
    });

    scrollState = computed(() => {
        return this.config()?.aiTable!.context!.scrollState();
    });

    visibleRangeInfo = computed(() => {
        return getVisibleRangeInfo(this.coordinate()!, this.scrollState()!);
    });

    frozenAreaWidth = computed(() => {
        return this.config().aiTable!.context!.rowHeadWidth() + this.coordinate()!.frozenColumnWidth!;
    });

    lastColumnWidth = computed(() => {
        return this.coordinate()!.getColumnWidth(this.visibleRangeInfo().columnStopIndex);
    });

    lastColumnOffset = computed(() => {
        return this.coordinate()!.getColumnOffset(this.visibleRangeInfo().columnStopIndex);
    });

    cellGroupClipWidth = computed(() => {
        return this.containerWidth() - this.frozenAreaWidth();
    });

    stageConfig = computed<Partial<StageConfig>>(() => {
        const { isScrolling } = this.scrollState()!;
        return {
            width: this.containerWidth(),
            height: this.containerHeight(),
            listening: isScrolling ? false : true
        };
    });

    gridGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: 0,
            clipY: 0,
            clipWidth: this.containerWidth(),
            clipHeight: this.gridContainerHeight()
        };
    });

    statGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            x: 0,
            y: this.containerHeight() - AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT,
            width: this.containerWidth(),
            height: AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT
        };
    });

    scrollTotalHeight = computed(() => {
        return Math.max(this.coordinate().totalHeight, this.containerHeight() - AI_TABLE_FIELD_HEAD_HEIGHT);
    });

    scrollTotalWidth = computed(() => {
        return this.coordinate().totalWidth + AI_TABLE_FIELD_ADD_BUTTON_WIDTH;
    });

    frozenCommonGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: 0,
            clipY: AI_TABLE_FIELD_HEAD_HEIGHT,
            clipWidth: this.frozenAreaWidth() + AI_TABLE_SHADOW_DEFAULT_WIDTH,
            clipHeight: this.gridContainerHeight()
        };
    });

    commonGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: this.frozenAreaWidth() + 1,
            clipY: 0,
            clipWidth: this.cellGroupClipWidth(),
            clipHeight: this.gridContainerHeight()
        };
    });

    statCommonGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            x: AI_TABLE_OFFSET,
            clipX: this.frozenAreaWidth() + 1,
            clipY: 0,
            clipWidth: this.cellGroupClipWidth(),
            clipHeight: this.gridContainerHeight()
        };
    });

    attachGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: this.frozenAreaWidth() - 1,
            clipY: this.coordinate()!.rowInitSize - 1,
            clipWidth: this.containerWidth() - this.frozenAreaWidth(),
            clipHeight: this.gridContainerHeight() - this.coordinate()!.rowInitSize
        };
    });

    frozenAttachGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: 0,
            clipY: this.coordinate()!.rowInitSize - 1,
            clipWidth: this.frozenAreaWidth() + 10,
            clipHeight: this.gridContainerHeight() - this.coordinate()!.rowInitSize
        };
    });

    frozenCoverAttachGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: 0,
            clipY: this.coordinate()!.rowInitSize + 1,
            clipWidth: this.frozenAreaWidth(),
            clipHeight: this.gridContainerHeight() - this.coordinate()!.rowInitSize
        };
    });

    offsetYConfig = computed<Partial<StageConfig>>(() => {
        const { scrollTop } = this.scrollState()!;
        return {
            offsetY: scrollTop
        };
    });

    offsetXConfig = computed<Partial<StageConfig>>(() => {
        const { scrollLeft } = this.scrollState()!;
        return {
            offsetX: scrollLeft
        };
    });

    offsetConfig = computed<Partial<StageConfig>>(() => {
        const { scrollLeft, scrollTop } = this.scrollState()!;
        return {
            offsetX: scrollLeft,
            offsetY: scrollTop
        };
    });

    columnFrozenHeadFieldConfig = computed(() => {
        const { columnStartIndex, columnStopIndex } = this.visibleRangeInfo();
        const { aiTable, coordinate, readonly, maxFields, actions } = this.config();
        const { pointPosition } = aiTable.context!;
        const fields = this.fields();
        return {
            aiTable,
            actions,
            coordinate,
            fields,
            columnStartIndex,
            columnStopIndex,
            pointPosition: pointPosition(),
            readonly,
            maxFields
        };
    });

    columnHeadFieldConfig = computed(() => {
        const { columnStartIndex, columnStopIndex } = this.visibleRangeInfo();
        const { aiTable, coordinate, readonly, maxFields, actions } = this.config();
        const { pointPosition } = aiTable.context!;
        const fields = this.fields();
        return {
            aiTable,
            actions,
            coordinate,
            fields,
            columnStartIndex,
            columnStopIndex,
            pointPosition: pointPosition(),
            readonly,
            maxFields
        };
    });

    columnFieldStatsConfig = computed<AITableFieldStatsConfig>(() => {
        return {
            ...this.columnHeadFieldConfig(),
            width: this.cellGroupClipWidth(),
            x: this.frozenAreaWidth(),
            y: AI_TABLE_OFFSET,
            height: AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT,
            isHoverStatContainer: this.isHoverStatContainer()
        };
    });

    xIsScroll = computed(() => {
        return this.scrollState().scrollLeft > 0;
    });

    statShadowConfig = computed<NodeConfig>(() => {
        return {
            width: 8,
            x: this.frozenAreaWidth() + 1,
            y: AI_TABLE_OFFSET,
            height: AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT,
            visible: this.xIsScroll()
        };
    });

    fieldHeadShadowConfig = computed<NodeConfig>(() => {
        return {
            width: AI_TABLE_SHADOW_DEFAULT_WIDTH,
            x: this.frozenAreaWidth() + 1,
            y: AI_TABLE_OFFSET,
            height: AI_TABLE_FIELD_HEAD_HEIGHT,
            visible: this.xIsScroll()
        };
    });

    columnFieldStatsBgConfig = computed<AITableBackgroundConfig>(() => {
        return {
            x: 0,
            y: 0,
            width: this.containerWidth(),
            height: AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT,
            fill: Colors.white,
            stroke: Colors.gray200,
            strokeWidth: AI_TABLE_CELL_LINE_BORDER,
            opacity: 1,
            borders: [true, false, true, false],
            listening: true,
            coordinate: this.coordinate()
        };
    });

    columnFrozenFieldStatsConfig = computed<AITableFieldStatsConfig>(() => {
        return {
            ...this.columnHeadFieldConfig(),
            width: this.frozenAreaWidth(),
            x: 0,
            y: AI_TABLE_OFFSET,
            columnStartIndex: 0,
            columnStopIndex: this.coordinate()!.frozenColumnCount - 1,
            height: AI_TABLE_FIELD_STAT_CONTAINER_HEIGHT,
            isHoverStatContainer: this.isHoverStatContainer()
        };
    });

    cellsConfig = computed<AITableCellsConfig>(() => {
        const { aiTable, readonly, coordinate, references, actions, maxRecords } = this.config();
        const { rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex } = this.visibleRangeInfo();
        return {
            aiTable,
            readonly,
            coordinate,
            references,
            rowStartIndex,
            rowStopIndex,
            columnStartIndex,
            columnStopIndex,
            actions,
            maxRecords
        };
    });

    readonly fillHandleConfig = computed<AITableFillHandleConfig>(() => {
        return {
            aiTable: this.config().aiTable,
            coordinate: this.coordinate(),
            readonly: this.readonly()
        };
    });

    readonly isLastSelectedCellInFrozenColumn = computed(() => {
        const { aiTable } = this.config();
        const selectedCells = Array.from(aiTable.selection().selectedCells);
        if (selectedCells.length === 0) return false;

        const lastCell = selectedCells[selectedCells.length - 1];
        const [, fieldId] = lastCell.split(':');
        const columnIndex = aiTable.context!.visibleColumnsIndexMap().get(fieldId)!;

        return AITable.isFrozenColumn(aiTable, columnIndex);
    });

    activeCellBorderConfig = computed(() => {
        return createActiveCellBorder(this.cellsConfig());
    });

    showExpandCellBorder = computed(() => {
        let expandCellBorder = false;
        let frozenExpandCellBorder = false;
        const { aiTable } = this.config();
        const expandCellPath = aiTable.expendCell()?.path;
        if (expandCellPath) {
            const { rowIndex, columnIndex } = AITable.getCellIndex(aiTable, expandCellPath)!;
            const isFrozenColumn = columnIndex < aiTable.context!.frozenColumnCount();
            if (isFrozenColumn) {
                frozenExpandCellBorder = true;
            } else {
                expandCellBorder = true;
            }
        }
        return {
            expandCellBorder,
            frozenExpandCellBorder
        };
    });

    stageMousemove(e: KoEventObject<MouseEvent>) {
        this.koMousemove.emit(e as KoEventObject<MouseEvent>);
    }

    stageMousedown(e: KoEventObject<MouseEvent>) {
        this.koMousedown.emit(e as KoEventObject<MouseEvent>);
    }

    stageMouseup(e: KoEventObject<MouseEvent>) {
        this.koMouseup.emit(e as KoEventObject<MouseEvent>);
    }

    stageContextmenu(e: KoEventObject<MouseEvent>) {
        this.koContextmenu.emit(e as KoEventObject<MouseEvent>);
    }

    stageClick(e: KoEventObject<MouseEvent>) {
        this.koClick.emit(e as KoEventObject<MouseEvent>);
    }

    stageDblclick(e: KoEventObject<MouseEvent>) {
        this.koDblclick.emit(e as KoEventObject<MouseEvent>);
    }

    stageMouseleave(e: KoEventObject<MouseEvent>) {
        this.koMouseleave.emit(e as KoEventObject<MouseEvent>);
    }

    stageWheel(e: KoEventObject<WheelEvent>) {
        this.koWheel.emit(e);
    }

    onStatContainerHover(isHover: boolean) {
        this.isHoverStatContainer.set(isHover);
    }
}
