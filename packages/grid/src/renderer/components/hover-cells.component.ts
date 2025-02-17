import { ChangeDetectionStrategy, Component, computed, input, SimpleChanges } from '@angular/core';
import { KoContainer, KoShape } from '../../angular-konva';
import { AITableCellsConfig } from '../../types';
import { getHoverCellConfig } from '../../utils/get-hover-cell';
import { AITableFieldType } from '../../core';
import { AITableCellLink } from './cells/link.component';
import { CommonModule } from '@angular/common';
import { AI_TABLE_CELL_BORDER, AI_TABLE_OFFSET, Colors } from '../../constants';

@Component({
    selector: 'ai-table-hover-cells',
    template: `
        @let cellConfig = hoverCellConfig();
        @if (cellConfig && outComponent()) {
            <ko-group [config]="groupConfig()">
                <ko-rect [config]="bgConfig()"></ko-rect>
                <ng-container *ngComponentOutlet="outComponent(); inputs: { config: cellConfig }"> </ng-container>
            </ko-group>
        }
    `,
    standalone: true,
    imports: [KoShape, KoContainer, CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableHoverCells {
    config = input.required<AITableCellsConfig>();

    groupConfig = computed(() => {
        return {
            x: this.hoverCellConfig()?.x,
            y: this.hoverCellConfig()?.y
        };
    });

    componentMap = {
        [AITableFieldType.link]: AITableCellLink as any,
        null: AITableCellLink as any
    } as any;

    outComponent = computed(() => {
        const type = this.componentType();
        if (type) {
            return this.componentMap[type];
        }
        return null;
    });

    bgConfig = computed(() => {
        const render = this.hoverCellConfig()?.render;
        const { aiTable } = this.config();
        if (render) {
            const { field, columnWidth, rowHeight } = render;
            const [recordId, fieldId] = aiTable.selection().activeCell || [];
            const isActiveCell = render?.field._id === fieldId && render?.recordId === recordId;

            return {
                x: isActiveCell ? AI_TABLE_OFFSET + AI_TABLE_CELL_BORDER / 2 : AI_TABLE_OFFSET,
                y: isActiveCell ? AI_TABLE_OFFSET + AI_TABLE_CELL_BORDER / 2 : AI_TABLE_OFFSET,
                width: isActiveCell ? columnWidth - AI_TABLE_CELL_BORDER * 2 : columnWidth,
                height: isActiveCell ? rowHeight - AI_TABLE_CELL_BORDER * 2 : rowHeight,
                stroke: Colors.gray200,
                strokeWidth: 1,
                opacity: 1,
                listening: false,
                perfectDrawEnabled: false
            };
        }
        return;
    });

    componentType = computed(() => {
        return this.hoverCellConfig()?.field?.type;
    });

    hoverCellConfig = computed(() => {
        const result = getHoverCellConfig({
            ...this.config()
        });
        return result;
    });
}
