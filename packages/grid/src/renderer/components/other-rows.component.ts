import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KoShape } from '../../angular-konva';
import { AI_TABLE_ROW_ADD_BUTTON } from '../../constants';
import { RendererContext } from '../../core';
import { AITableRowHeadsOptions, AITableRowType } from '../../types';

@Component({
    selector: 'ai-table-other-rows',
    template: `
        @for (config of otherConfigs(); track $index) {
            @switch (config.type) {
                @case (AITableRowType.add) {
                    <ko-rect [config]="config.addBtnConfig"></ko-rect>
                }
            }
        }
    `,
    standalone: true,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableOtherRows {
    config = input.required<AITableRowHeadsOptions>();

    AITableRowType = AITableRowType;

    otherConfigs = computed(() => {
        return this.createOtherRows(this.config());
    });

    createOtherRows = (options: AITableRowHeadsOptions) => {
        const { coordinate, rowStartIndex, rowStopIndex, aiTable } = options;
        const otherRowConfigs = [];
        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
            if (rowIndex > coordinate.rowCount - 1) break;
            const { _id, type } = (aiTable.context as RendererContext).linearRows()[rowIndex];
            if (type === AITableRowType.record) continue;
            const y = coordinate.getRowOffset(rowIndex);
            const curHeight = coordinate.getRowHeight(rowIndex);

            otherRowConfigs.push({
                type,
                addBtnConfig: {
                    key: `row-add-${_id}`,
                    y: y + 1,
                    name: AI_TABLE_ROW_ADD_BUTTON,
                    width: coordinate.containerWidth,
                    height: curHeight - 1,
                    fill: 'transparent'
                }
            });
        }
        return otherRowConfigs;
    };
}
