import { KoShape } from '../../angular-konva';
import { Component, computed, input } from '@angular/core';
import { AITableFillHandleConfig } from '../../types';
import { AI_TABLE_CELL_BORDER, AI_TABLE_FILL_HANDLE, AI_TABLE_OFFSET, AI_TABLE_ROW_HEIGHT, Colors } from '../../constants';
import { generateTargetName } from '../../utils';

@Component({
    selector: 'ai-table-fill-handle',
    template: `
        @if (hasSelectedCells() && !readonly()) {
            <ko-rect [config]="handleConfig()"></ko-rect>
        }
    `,
    imports: [KoShape]
})
export class AITableFillHandle {
    readonly config = input.required<AITableFillHandleConfig>();

    readonly hasSelectedCells = computed(() => {
        return this.config().aiTable.selection().selectedCells.size > 0;
    });

    readonly readonly = computed(() => {
        return this.config().readonly;
    });

    readonly handleConfig = computed(() => {
        const { aiTable, coordinate } = this.config();
        const selectedCells = Array.from(aiTable.selection().selectedCells);
        const lastCell = selectedCells[selectedCells.length - 1];
        const [recordId, fieldId] = lastCell.split(':');
        const { scrollLeft, scrollTop } = aiTable.context!.scrollState();

        const columnIndex = aiTable.context!.visibleColumnsIndexMap().get(fieldId)!;
        const columnOffset = coordinate.getColumnOffset(columnIndex);
        const columnWidth = coordinate.getColumnWidth(columnIndex);
        const x = columnOffset + columnWidth - scrollLeft;

        const rowIndex = aiTable.context!.visibleRowsIndexMap().get(recordId)!;
        const rowOffset = coordinate.getRowOffset(rowIndex);
        const y = rowOffset + AI_TABLE_ROW_HEIGHT - scrollTop;

        const width = 6;
        const height = 6;

        return {
            x: x - width / 2 + AI_TABLE_OFFSET,
            y: y - height + AI_TABLE_CELL_BORDER + AI_TABLE_OFFSET,
            width,
            height,
            fill: Colors.primary,
            stroke: Colors.white,
            strokeWidth: 2,
            name: generateTargetName({
                targetName: AI_TABLE_FILL_HANDLE,
                fieldId,
                recordId
            })
        };
    });
}
