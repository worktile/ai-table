import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KoContainer } from '../../angular-konva';
import { AI_TABLE_OFFSET, ExpandRecordPath, Colors } from '../../constants';
import { AITableActionIconConfig, AITableBackgroundConfig, AITableExpandRecordConfig, AITableRowType } from '../../types';
import { generateTargetName } from '../../utils';
import {
    AI_TABLE_ACTION_COMMON_RADIUS,
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_CELL_LINE_BORDER,
    AI_TABLE_EXPAND_RECORD_ICON,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_ROW_HEAD_EXPAND_WIDTH
} from '../../constants/table';
import { AITableActionIcon } from './action-icon.component';
import { AITableBackground } from './background.component';
import { AITableFieldType } from '../../../../utils/src';

@Component({
    selector: 'ai-table-expand-record',
    template: `
        <ko-group>
            @if (shouldShowIcon()) {
                <ai-table-background [config]="backgroundConfig()"></ai-table-background>
                <ai-table-action-icon [config]="expandIconConfig()"></ai-table-action-icon>
            }
        </ko-group>
    `,
    imports: [KoContainer, AITableActionIcon, AITableBackground],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableExpandRecord {
    config = input.required<AITableExpandRecordConfig>();

    backgroundConfig = computed<AITableBackgroundConfig>(() => {
        const { coordinate, aiTable } = this.config()!;
        const context = aiTable.context!;
        const { rowIndex: pointRowIndex, columnIndex } = context.pointPosition();
        const firstColumnOffset = coordinate.getColumnOffset(0);
        const y = coordinate.getRowOffset(pointRowIndex) + AI_TABLE_OFFSET;
        const rowHeight = coordinate.getRowHeight(pointRowIndex);
        const firstField = aiTable.gridData().fields[0];
        const isRateOrProgress = firstField?.type === AITableFieldType.rate || firstField?.type === AITableFieldType.progress;
        const isFirstColumn = columnIndex === 0;
        return {
            coordinate,
            x: firstColumnOffset - AI_TABLE_ROW_HEAD_EXPAND_WIDTH,
            y: y,
            width: AI_TABLE_ROW_HEAD_EXPAND_WIDTH + AI_TABLE_CELL_LINE_BORDER * 2 + AI_TABLE_OFFSET,
            height: rowHeight,
            fill: isRateOrProgress && isFirstColumn ? Colors.white : Colors.transparent,
            hoverFill: Colors.transparent,
            listening: true
        };
    });

    shouldShowIcon = computed(() => {
        const { aiTable, rowStartIndex, rowStopIndex } = this.config();
        const context = aiTable.context;
        if (!context) return false;

        if (!context.recordDetailConfig?.()?.showExpandIcon) return false;

        const { rowIndex: pointRowIndex } = context.pointPosition();
        const row = context.linearRows()[pointRowIndex];
        return pointRowIndex >= rowStartIndex && pointRowIndex <= rowStopIndex && row && row.type === AITableRowType.record;
    });

    expandIconConfig = computed<AITableActionIconConfig>(() => {
        const { coordinate, aiTable } = this.config()!;
        const context = aiTable.context!;
        const { rowIndex: pointRowIndex } = context.pointPosition();
        const row = context.linearRows()[pointRowIndex];
        const recordId = row?._id;

        const firstColumnOffset = coordinate.getColumnOffset(0);
        const y = coordinate.getRowOffset(pointRowIndex) + AI_TABLE_OFFSET;
        return {
            coordinate,
            name: generateTargetName({
                targetName: AI_TABLE_EXPAND_RECORD_ICON,
                recordId,
                mouseStyle: 'pointer'
            }),
            x: firstColumnOffset - AI_TABLE_ROW_HEAD_EXPAND_WIDTH + (AI_TABLE_ROW_HEAD_EXPAND_WIDTH - AI_TABLE_ACTION_COMMON_SIZE) / 2,
            y: y + (AI_TABLE_FIELD_HEAD_HEIGHT - AI_TABLE_ACTION_COMMON_SIZE) / 2,
            data: ExpandRecordPath,
            fill: Colors.gray600,
            hoverFill: Colors.primary,
            backgroundWidth: AI_TABLE_ACTION_COMMON_SIZE,
            backgroundHeight: AI_TABLE_ACTION_COMMON_SIZE,
            cornerRadius: AI_TABLE_ACTION_COMMON_RADIUS,
            listening: true
        };
    });
}
