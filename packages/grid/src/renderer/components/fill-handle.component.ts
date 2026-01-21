import { KoShape } from '../../angular-konva';
import { Component, computed, input } from '@angular/core';
import { AITableFillHandleConfig } from '../../types';
import {
    AI_TABLE_CELL_BORDER,
    AI_TABLE_CELL_LINE_BORDER,
    AI_TABLE_FILL_HANDLE,
    AI_TABLE_OFFSET,
    AI_TABLE_ROW_HEIGHT,
    Colors
} from '../../constants';
import { generateTargetName } from '../../utils';

@Component({
    selector: 'ai-table-fill-handle',
    template: `
        @if (showFillHandle()) {
            <ko-rect [config]="handleConfig()"></ko-rect>
        }
    `,
    imports: [KoShape]
})
export class AITableFillHandle {
    readonly config = input.required<AITableFillHandleConfig>();

    readonly showFillHandle = computed(() => {
        const { aiTable, readonly } = this.config();
        const selection = aiTable.selection();
        const hasSelectedCells = selection.selectedCells.size > 0;
        const isEditingCell = !!aiTable.editingCell()?.path;
        return hasSelectedCells && !readonly && !isEditingCell;
    });

    readonly handleConfig = computed(() => {
        const { aiTable, coordinate } = this.config();
        const selectedCells = Array.from(aiTable.selection().selectedCells);
        const lastCell = selectedCells[selectedCells.length - 1];
        const [recordId, fieldId] = lastCell.split(':');

        const columnIndex = aiTable.context!.visibleColumnsIndexMap().get(fieldId)!;
        const columnOffset = coordinate.getColumnOffset(columnIndex);
        const columnWidth = coordinate.getColumnWidth(columnIndex);

        const rowIndex = aiTable.context!.visibleRowsIndexMap().get(recordId)!;
        const rowOffset = coordinate.getRowOffset(rowIndex);

        const width = 6;
        const height = 6;

        const [expandRecordId, expandFieldId] = aiTable.expendCell()?.path || [null, null];

        const cellHeight =
            expandRecordId === recordId && expandFieldId === fieldId && aiTable.expendCell()?.height
                ? aiTable.expendCell()?.height
                    ? aiTable.expendCell()!.height! + AI_TABLE_CELL_LINE_BORDER
                    : coordinate.rowInitSize
                : coordinate.rowInitSize;
        return {
            x: columnOffset + columnWidth - width / 2 + AI_TABLE_OFFSET,
            y: rowOffset + cellHeight - height + AI_TABLE_CELL_BORDER + AI_TABLE_OFFSET,
            width,
            height,
            fill: Colors.primary,
            stroke: Colors.white,
            strokeWidth: 2,
            // zIndex: 20,
            name: generateTargetName({
                targetName: AI_TABLE_FILL_HANDLE,
                fieldId,
                recordId
            })
        };
    });
}
