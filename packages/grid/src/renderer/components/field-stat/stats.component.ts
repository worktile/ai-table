import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AITableColumnHeadsConfig, AITableFieldStatsConfig } from '../../../types';
import { createFieldStats } from '../../creations/create-stats';
import { AITableFieldStat } from './stat.component';

@Component({
    selector: 'ai-table-column-stats',
    template: `
        @for (config of statConfigs(); track $index) {
            <ai-table-field-stat [config]="config"></ai-table-field-stat>
        }
    `,
    imports: [AITableFieldStat],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFieldStats {
    config = input.required<AITableFieldStatsConfig>();

    statConfigs = computed(() => {
        const { coordinate, columnStartIndex } = this.config();
        const { frozenColumnCount } = coordinate;

        return createFieldStats({
            ...this.config(),
            columnStartIndex: Math.max(columnStartIndex, frozenColumnCount)
        });
    });
}
