import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { AITableColumnHeadsConfig, AITableFieldStatsConfig } from '../../../types';
import { createFieldStats } from '../../creations/create-stats';
import { AITableFieldStat } from './stat.component';
import { Colors } from '../../../constants';
import { KoContainer, KoEventObject } from '../../../angular-konva';
import { generateTargetName } from '../../../utils';

@Component({
    selector: 'ai-table-column-stats',
    template: `
        <ko-group>
            @for (config of statConfigs(); track $index) {
                <ai-table-field-stat [config]="config"></ai-table-field-stat>
            }
        </ko-group>
    `,
    imports: [AITableFieldStat, KoContainer],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFieldStats {
    config = input.required<AITableFieldStatsConfig>();

    isHover = signal(false);

    bgConfig = computed(() => {
        const { x, y, width, height, coordinate } = this.config();
        return {
            coordinate,
            x,
            y,
            name: generateTargetName({
                targetName: 'sssffff',
                mouseStyle: 'pointer'
            }),
            width: width,
            height: height,
            // fill: Colors.black,
            hoverFill: Colors.gray100,
            stroke: Colors.black,
            strokeWidth: 1,
            opacity: 1,
            listening: true
        };
    });

    onMouseenter(e: KoEventObject<MouseEvent>) {
        this.isHover.set(true);
    }

    onMouseleave(e: KoEventObject<MouseEvent>) {
        this.isHover.set(false);
    }

    statConfigs = computed(() => {
        const { coordinate, columnStartIndex } = this.config();
        const { frozenColumnCount } = coordinate;

        return createFieldStats({
            ...this.config(),
            columnStartIndex: Math.max(columnStartIndex, frozenColumnCount)
        });
    });
}
