import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KoShape } from '../../angular-konva';
import { AITableCellsOptions } from '../../types';
import { getPlaceHolderCellsConfigs } from '../../utils';

@Component({
    selector: 'ai-table-placeholder-cells',
    template: `
        @for (item of frozenPlaceHolderCellsConfig(); track $index) {
            <ko-rect [config]="item"></ko-rect>
        }
    `,
    standalone: true,
    imports: [KoShape],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITablePlaceholderCells {
    options = input.required<AITableCellsOptions>();

    frozenPlaceHolderCellsConfig = computed(() => {
        return getPlaceHolderCellsConfigs(this.options());
    });
}
