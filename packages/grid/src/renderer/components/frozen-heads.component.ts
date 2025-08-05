import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoShape, KoContainer } from '../../angular-konva';
import {
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_INDEX_FIELD_TEXT,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_DRAG_ICON_WIDTH,
    AI_TABLE_TEXT_LINE_HEIGHT,
    Colors
} from '../../constants';
import { AITableCheckType, AITableColumnHeadsConfig, AITableSelectAllState } from '../../types';
import { createColumnHeads } from '../creations/create-heads';
import { AITableFieldHead } from './field-head.component';
import { AITableIcon } from './icon.component';
import { AITableTextComponent } from './text.component';
import { TextMeasure } from '../../utils';

@Component({
    selector: 'ai-table-frozen-column-heads',
    template: `
        <ko-rect [config]="headBgConfig()"></ko-rect>
        @if (!hiddenIndexColumn()) {
            <ko-rect [config]="dragHeadBgConfig()"></ko-rect>
            <ko-rect [config]="numberHeadBgConfig()"></ko-rect>
            <ko-line [config]="topLineConfig()"></ko-line>
            <ko-line [config]="bottomLineConfig()"></ko-line>
            <ko-group>
                @if (!readonly()) {
                    <ai-table-icon [config]="iconConfig()"></ai-table-icon>
                } @else {
                    <ai-table-text [config]="textConfig()"></ai-table-text>
                }
            </ko-group>
        } @else {
            @for (lineConfig of cellLinesConfig(); track $index) {
                <ko-line [config]="lineConfig"></ko-line>
            }
        }
        @for (config of headConfigs(); track $index) {
            <ai-table-field-head [config]="config"></ai-table-field-head>
        }
    `,
    imports: [KoShape, AITableFieldHead, AITableIcon, AITableTextComponent, KoContainer],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFrozenColumnHeads {
    config = input.required<AITableColumnHeadsConfig>();

    textMeasure = TextMeasure();

    coordinate = computed(() => {
        const config = this.config();
        if (!config) return null;
        return config.coordinate;
    });

    hiddenIndexColumn = computed(() => {
        const context = this.context();
        if (!context) return false;
        return context?.aiFieldConfig()?.hiddenIndexColumn;
    });

    context = computed(() => {
        const config = this.config();
        if (!config) return null;
        return config?.aiTable.context;
    });

    readonly = computed(() => {
        const context = this.context();
        return !!context?.readonly?.();
    });

    isChecked = computed(() => {
        const config = this.config();
        if (!config) return false;

        const selectedRecords = config.aiTable.selection().selectedRecords;
        const selectedAllState =
            selectedRecords.size === config.aiTable.records().length
                ? AITableSelectAllState.all
                : selectedRecords.size === 0
                  ? AITableSelectAllState.none
                  : AITableSelectAllState.partial;
        return selectedAllState === AITableSelectAllState.all;
    });

    fieldHeadHeight = computed(() => {
        const coord = this.coordinate();
        if (!coord) return 0;
        return coord.rowInitSize;
    });

    headConfigs = computed(() => {
        const coord = this.coordinate();
        if (!coord) return [];
        return createColumnHeads({
            ...this.config(),
            columnStartIndex: 0,
            columnStopIndex: coord.frozenColumnCount - 1
        });
    });

    dragHeadBgConfig = computed<Partial<StageConfig>>(() => {
        return {
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            width: AI_TABLE_ROW_DRAG_ICON_WIDTH,
            height: this.fieldHeadHeight(),
            fill: Colors.white,
            listening: false
        };
    });

    numberHeadBgConfig = computed<Partial<StageConfig>>(() => {
        const ctx = this.context();
        if (!ctx) return { width: 0, height: 0 };
        return {
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            width: ctx.rowHeadWidth() || 0,
            height: this.fieldHeadHeight(),
            fill: Colors.white,
            listening: false
        };
    });

    dragOccupyWidth = computed(() => {
        const ctx = this.context();
        return ctx?.aiFieldConfig()?.hiddenRowDrag || this.readonly() ? 0 : AI_TABLE_ROW_DRAG_ICON_WIDTH;
    });

    topLineConfig = computed(() => {
        const ctx = this.context();
        if (!ctx) return { points: [0, 0, 0, 0] };
        return {
            x: AI_TABLE_OFFSET + this.dragOccupyWidth(),
            y: AI_TABLE_OFFSET,
            points: [0, 0, ctx.rowHeadWidth(), 0],
            stroke: Colors.gray200,
            strokeWidth: 1,
            listening: false
        };
    });

    bottomLineConfig = computed(() => {
        const ctx = this.context();
        if (!ctx) return { points: [0, 0, 0, 0] };
        return {
            x: AI_TABLE_OFFSET + this.dragOccupyWidth(),
            y: AI_TABLE_OFFSET,
            points: [ctx.rowHeadWidth(), this.fieldHeadHeight(), 0, this.fieldHeadHeight()],
            stroke: Colors.gray200,
            strokeWidth: 1,
            listening: false
        };
    });

    iconConfig = computed(() => {
        return {
            name: AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
            x: AI_TABLE_CELL_PADDING + this.dragOccupyWidth(),
            y: (this.fieldHeadHeight() - AI_TABLE_ICON_COMMON_SIZE) / 2,
            type: this.isChecked() ? AITableCheckType.checked : AITableCheckType.unchecked,
            fill:
                this.isChecked() || (this.config().pointPosition.targetName === AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX && !this.isChecked())
                    ? Colors.primary
                    : Colors.gray300
        };
    });

    textConfig = computed(() => {
        const text = AI_TABLE_INDEX_FIELD_TEXT;
        const lineHeight = AI_TABLE_TEXT_LINE_HEIGHT;
        const measureText = TextMeasure().measureText(text);
        return {
            x: AI_TABLE_CELL_PADDING + this.dragOccupyWidth() + measureText.width / 2,
            y: measureText.height / 2,
            width: measureText.width,
            height: measureText.height,
            text,
            lineHeight
        };
    });

    headBgConfig = computed(() => {
        const coord = this.coordinate();
        const ctx = this.context();
        if (!coord || !ctx) return { width: 0, height: 0 };
        return {
            x: ctx.rowHeadWidth(),
            y: AI_TABLE_OFFSET,
            width: coord.frozenColumnWidth + AI_TABLE_OFFSET,
            height: this.fieldHeadHeight(),
            stroke: Colors.gray200,
            strokeWidth: this.hiddenIndexColumn() ? 0 : 1,
            fill: Colors.transparent,
            listening: false,
            zIndex: 10
        };
    });

    cellLinesConfig = computed(() => {
        const coord = this.coordinate();
        const ctx = this.context();
        if (!coord || !ctx) return [];
        return [
            {
                x: ctx.rowHeadWidth(),
                y: AI_TABLE_OFFSET,
                points: [0, 0, coord.frozenColumnWidth + AI_TABLE_OFFSET, 0],
                stroke: Colors.gray200,
                strokeWidth: 1,
                listening: false,
                zIndex: 10
            },
            {
                x: ctx.rowHeadWidth(),
                y: AI_TABLE_OFFSET,
                points: [coord.frozenColumnWidth + AI_TABLE_OFFSET, 0, coord.frozenColumnWidth + AI_TABLE_OFFSET, this.fieldHeadHeight()],
                stroke: Colors.gray200,
                strokeWidth: 1,
                listening: false,
                zIndex: 10
            },
            {
                x: ctx.rowHeadWidth(),
                y: AI_TABLE_OFFSET,
                points: [0, this.fieldHeadHeight(), coord.frozenColumnWidth + AI_TABLE_OFFSET, this.fieldHeadHeight()],
                stroke: Colors.gray200,
                strokeWidth: 1,
                listening: false,
                zIndex: 10
            }
        ];
    });
}
