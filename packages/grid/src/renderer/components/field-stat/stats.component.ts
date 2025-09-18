import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { AITableColumnHeadsConfig, AITableFieldStatConfig, AITableFieldStatsConfig } from '../../../types';
import { createFieldStats } from '../../creations/create-stats';
import { AITableFieldStat } from './stat.component';
import { Colors } from '../../../constants';
import { KoContainer, KoEventObject } from '../../../angular-konva';
import { generateTargetName } from '../../../utils';

@Component({
    selector: 'ai-table-column-stats',
    template: `
        <ko-group>
            @for (config of statConfigs(); track trackBy(config)) {
                <ai-table-field-stat [config]="config" (hover)="hover.emit($event)"></ai-table-field-stat>
            }
        </ko-group>
    `,
    imports: [AITableFieldStat, KoContainer],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFieldStats {
    config = input.required<AITableFieldStatsConfig>();

    hover = output<boolean>();

    isHover = signal(false);

    trackBy = (groupStat: AITableFieldStatConfig) => {
        return groupStat.columnIndex;
    };

    onMouseenter(e: KoEventObject<MouseEvent>) {
        this.isHover.set(true);
    }

    onMouseleave(e: KoEventObject<MouseEvent>) {
        this.isHover.set(false);
    }

    statConfigs = computed(() => createFieldStats(this.config()));
}
