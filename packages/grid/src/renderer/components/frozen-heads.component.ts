import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoShape, KoContainer } from '../../angular-konva';
import {
    AI_TABLE_CELL_LINE_BORDER,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_FIELD_HEAD_SELECT_CHECKBOX,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_INDEX_FIELD_TEXT,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_DRAG_ICON_WIDTH,
    AI_TABLE_ROW_HEAD_EXPAND_WIDTH,
    AI_TABLE_ROW_HEAD_WIDTH,
    AI_TABLE_ROW_HEAD_WIDTH_AND_DRAG_ICON_WIDTH,
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
        @if (!hiddenIndexColumn()) {
            <ko-group>
                @if (!readonly()) {
                    <ai-table-icon [config]="iconConfig()"></ai-table-icon>
                } @else {
                    <ai-table-text [config]="textConfig()"></ai-table-text>
                }
            </ko-group>
        }

        @for (config of headConfigs(); track $index) {
            <ai-table-field-head [config]="config"></ai-table-field-head>
        }
        @for (lineConfig of cellLinesConfig(); track $index) {
            <ko-line [config]="lineConfig"></ko-line>
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
        // return coord.rowInitSize;
        return AI_TABLE_FIELD_HEAD_HEIGHT;
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
            width: ctx.rowHeadWidth() - AI_TABLE_CELL_LINE_BORDER || 0,
            height: this.fieldHeadHeight(),
            fill: Colors.white,
            listening: false
        };
    });

    topLineConfig = computed(() => {
        const ctx = this.context();
        if (!ctx) return { points: [0, 0, 0, 0] };
        return {
            x: AI_TABLE_OFFSET + AI_TABLE_ROW_DRAG_ICON_WIDTH,
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
            x: AI_TABLE_OFFSET + AI_TABLE_ROW_DRAG_ICON_WIDTH,
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
            x: AI_TABLE_CELL_PADDING + AI_TABLE_ROW_DRAG_ICON_WIDTH,
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
            x: AI_TABLE_CELL_PADDING + AI_TABLE_ROW_DRAG_ICON_WIDTH + measureText.width / 2,
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

        const showExpandIcon = !!ctx.recordDetailConfig?.()?.showExpandIcon;
        let width = showExpandIcon
            ? coord.frozenColumnWidth + AI_TABLE_OFFSET + AI_TABLE_ROW_HEAD_EXPAND_WIDTH + AI_TABLE_ROW_HEAD_WIDTH
            : coord.frozenColumnWidth + AI_TABLE_OFFSET + AI_TABLE_ROW_HEAD_WIDTH;

        if (ctx.aiFieldConfig()?.hiddenIndexColumn) {
            width -= AI_TABLE_ROW_HEAD_WIDTH;
        }

        const lines = [
            // 上边界线
            {
                x: AI_TABLE_ROW_DRAG_ICON_WIDTH,
                y: AI_TABLE_OFFSET,
                points: [0, 0, width, 0],
                stroke: Colors.gray200,
                strokeWidth: 1,
                listening: false,
                zIndex: 10
            },
            // 下边界线
            {
                x: AI_TABLE_ROW_DRAG_ICON_WIDTH,
                y: AI_TABLE_OFFSET,
                points: [0, this.fieldHeadHeight(), width, this.fieldHeadHeight()],
                stroke: Colors.gray200,
                strokeWidth: 1,
                listening: false,
                zIndex: 10
            },
            {
                x: AI_TABLE_ROW_DRAG_ICON_WIDTH,
                y: AI_TABLE_OFFSET,
                points: [width, 0, width, this.fieldHeadHeight()],
                stroke: Colors.gray200,
                strokeWidth: 1,
                listening: false,
                zIndex: 10
            }
        ];

        if (!ctx.aiFieldConfig()?.hiddenIndexColumn) {
            // index 竖线
            lines.push({
                x: 0,
                y: AI_TABLE_OFFSET,
                points: [
                    AI_TABLE_ROW_HEAD_WIDTH_AND_DRAG_ICON_WIDTH,
                    0,
                    AI_TABLE_ROW_HEAD_WIDTH_AND_DRAG_ICON_WIDTH,
                    this.fieldHeadHeight()
                ],
                stroke: Colors.gray200,
                strokeWidth: 1,
                listening: false,
                zIndex: 10
            });
        }

        return lines;
    });
}
