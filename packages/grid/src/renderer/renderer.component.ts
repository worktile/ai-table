import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import Konva from 'konva';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer, KoEventObject, KoShape, KoStage } from '../angular-konva';
import { AITable } from '../core';
import { AITableCellsConfig, AITableFieldStatsConfig, AITableRendererConfig } from '../types';
import { getVisibleRangeInfo } from '../utils';
import {
    AITableAddField,
    AITableCells,
    AITableColumnHeads,
    AITableFrozenCells,
    AITableFrozenColumnHeads,
    AITableFrozenPlaceholderCells,
    AITableHoverRowHeads,
    AITableOtherRows,
    AITablePlaceholderCells
} from './components';
import { createActiveCellBorder } from './creations/create-active-cell-border';
import { AITableCoverCells } from './components/cover-cell.component';
import { AITableFieldStats } from './components/field-stat/stats.component';
import { AI_TABLE_CELL_LINE_BORDER, AI_TABLE_FIELD_STAT_HEIGHT, AI_TABLE_OFFSET } from '../constants';

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
        AITableCoverCells,
        AITablePlaceholderCells,
        AITableAddField,
        AITableHoverRowHeads,
        AITableOtherRows,
        AITableFieldStats
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
            clipHeight: this.containerHeight()
        };
    });

    commonGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: this.frozenAreaWidth() + 1,
            clipY: 0,
            clipWidth: this.cellGroupClipWidth(),
            clipHeight: this.containerHeight()
        };
    });

    attachGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: this.frozenAreaWidth() - 1,
            clipY: this.coordinate()!.rowInitSize - 1,
            clipWidth: this.containerWidth() - this.frozenAreaWidth(),
            clipHeight: this.containerHeight() - this.coordinate()!.rowInitSize
        };
    });

    frozenAttachGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: 0,
            clipY: this.coordinate()!.rowInitSize - 1,
            clipWidth: this.frozenAreaWidth(),
            clipHeight: this.containerHeight() - this.coordinate()!.rowInitSize
        };
    });

    frozenCoverAttachGroupConfig = computed<Partial<StageConfig>>(() => {
        return {
            clipX: 0,
            clipY: this.coordinate()!.rowInitSize + 1,
            clipWidth: this.frozenAreaWidth(),
            clipHeight: this.containerHeight() - this.coordinate()!.rowInitSize
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
            y: this.containerHeight() - AI_TABLE_FIELD_STAT_HEIGHT - AI_TABLE_CELL_LINE_BORDER,
            height: AI_TABLE_FIELD_STAT_HEIGHT
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

    activeCellBorderConfig = computed(() => {
        return createActiveCellBorder(this.cellsConfig());
    });

    showExpandCellBorder = computed(() => {
        let expandCellBorder = false;
        let frozenExpandCellBorder = false;
        const { aiTable } = this.config();
        const expandCellPath = aiTable.selection().expandCell;
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
}
