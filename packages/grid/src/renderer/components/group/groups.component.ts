import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AITableCellsConfig, AITableFieldStatConfig, AITableGroupStatConfig, AITableIconConfig } from '../../../types';
import { createGroupCells } from '../../creations/create-groups';
import { AITableIcon } from '../icon.component';
import { createGroupFieldStats } from '../../creations/create-stats';
import { AITableFieldStat } from '../field-stat/stat.component';

@Component({
    selector: 'ai-table-groups',
    template: `
        @for (groupCell of groupCells(); track $index) {
            <ai-table-field-stat [config]="groupCell.groupStat!"></ai-table-field-stat>
        }
    `,
    imports: [CommonModule, AITableFieldStat],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableGroups {
    config = input.required<AITableCellsConfig>();

    frozenColumnCount = computed(() => {
        const { coordinate } = this.config();
        return coordinate.frozenColumnCount ?? 0;
    });

    columnStartIndex = computed(() => {
        const { columnStartIndex } = this.config();
        return Math.max(columnStartIndex, this.frozenColumnCount());
    });

    groups = computed(() => {
        return createGroupCells({
            ...this.config(),
            columnStartIndex: this.columnStartIndex()
        });
    });

    groupCells = computed(() => {
        const groups = this.groups();
        const groupCells: {
            groupStat?: AITableGroupStatConfig;
        }[] = [];

        groups.forEach((group) => {
            const { row, x = 0, y = 0 } = group;
            const groupStats = createGroupFieldStats({
                ...this.config(),
                groupRow: row,
                x,
                y,
                columnStartIndex: this.columnStartIndex()
            });
            groupStats.forEach((groupStat) => {
                groupCells.push({ groupStat: groupStat });
            });
        });
        return groupCells;
    });
}
