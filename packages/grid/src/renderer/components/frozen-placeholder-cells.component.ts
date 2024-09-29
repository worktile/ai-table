import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KoShape } from '../../angular-konva';
import { AITableCellsConfig } from '../../types';
import { getPlaceHolderCellsConfigs } from '../../utils';

@Component({
    selector: 'ai-table-frozen-placeholder-cells',
    template: `
        @for (item of frozenPlaceHolderCellsConfig(); track $index) {
            <ko-rect [config]="item"></ko-rect>
        }
    `,
    standalone: true,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFrozenPlaceholderCells {
    config = input.required<AITableCellsConfig>();

    frozenPlaceHolderCellsConfig = computed(() => {
        const { coordinate } = this.config();
        return getPlaceHolderCellsConfigs({
            ...this.config(),
            columnStartIndex: 0,
            columnStopIndex: coordinate.frozenColumnCount - 1
        });
    });
}
