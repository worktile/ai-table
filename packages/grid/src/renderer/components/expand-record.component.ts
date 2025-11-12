import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KoContainer } from '../../angular-konva';
import { AITable } from '../../core';
import { AITableIcon } from './icon.component';
import { AI_TABLE_ICON_COMMON_SIZE, AI_TABLE_OFFSET, ExpandRecordPath, Colors } from '../../constants';
import { AITableIconConfig, AITableRowType } from '../../types';
import { generateTargetName } from '../../utils';
import { AI_TABLE_EXPAND_RECORD_ICON } from '../../constants/table';

export interface AITableExpandRecordConfig {
    aiTable: AITable;
    coordinate: any;
    rowStartIndex: number;
    rowStopIndex: number;
}

@Component({
    selector: 'ai-table-expand-record',
    template: `
        <ko-group>
            @if (shouldShowIcon()) {
                <ai-table-icon [config]="expandIconConfig()"></ai-table-icon>
            }
        </ko-group>
    `,
    imports: [KoContainer, AITableIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableExpandRecord {
    config = input.required<AITableExpandRecordConfig>();

    shouldShowIcon = computed(() => {
        const { aiTable, rowStartIndex, rowStopIndex } = this.config();
        const context = aiTable.context;
        if (!context) return false;

        const { rowIndex: pointRowIndex } = context.pointPosition();
        const row = context.linearRows()[pointRowIndex];

        // 只有当鼠标在某一行上且该行是 record 时才显示图标
        return pointRowIndex >= rowStartIndex && pointRowIndex <= rowStopIndex && row && row.type === AITableRowType.record;
    });

    expandIconConfig = computed<AITableIconConfig>(() => {
        const { aiTable, coordinate } = this.config();
        const context = aiTable.context!;
        const { rowIndex: pointRowIndex } = context.pointPosition();
        const rowHeight = coordinate.rowHeight;
        const firstColumnWidth = coordinate.getColumnWidth(0);
        const firstColumnOffset = coordinate.getColumnOffset(0);

        const y = coordinate.getRowOffset(pointRowIndex) + AI_TABLE_OFFSET;
        const iconSize = AI_TABLE_ICON_COMMON_SIZE;
        const padding = 8;
        const x = firstColumnOffset + firstColumnWidth - iconSize - padding;
        const row = context.linearRows()[pointRowIndex];
        const recordId = row?._id;

        return {
            x,
            y: y + (rowHeight - iconSize) / 2,
            data: ExpandRecordPath,
            fill: Colors.gray600,
            name: recordId
                ? generateTargetName({
                      targetName: AI_TABLE_EXPAND_RECORD_ICON,
                      recordId: recordId,
                      mouseStyle: 'pointer'
                  })
                : undefined
        };
    });
}
