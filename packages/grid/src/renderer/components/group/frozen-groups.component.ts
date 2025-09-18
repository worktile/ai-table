import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AITableCellsConfig, AITableFieldStatConfig, AITableGroupStatConfig, AITableIconConfig } from '../../../types';
import { createGroupCells } from '../../creations/create-groups';
import { generateTargetName } from '../../../utils';
import { AI_TABLE_ICON_COMMON_SIZE, AI_TABLE_ROW_GROUP_COLLAPSE_BUTTON, AngleDownPath, AngleRightPath } from '../../../constants';
import { AITableIcon } from '../icon.component';
import { createGroupFieldStats } from '../../creations/create-stats';
import { AITableFieldStat } from '../field-stat/stat.component';
import { KoEventObject } from '../../../angular-konva';

@Component({
    selector: 'ai-table-frozen-groups',
    template: `
        @for (groupCell of groupCells(); track $index) {
            @if (groupCell.collapsedIcon) {
                <ai-table-icon [config]="groupCell.collapsedIcon" (koClick)="collapseClick($event)"></ai-table-icon>
            }
            <ai-table-field-stat [config]="groupCell.groupStat!"></ai-table-field-stat>
        }
    `,
    imports: [CommonModule, AITableIcon, AITableFieldStat],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFrozenGroups {
    config = input.required<AITableCellsConfig>();

    frozenColumnCount = computed(() => {
        const { coordinate } = this.config();
        return coordinate.frozenColumnCount ?? 0;
    });

    columnStopIndex = computed(() => {
        return this.frozenColumnCount() - 1;
    });

    groups = computed(() => {
        return createGroupCells({
            ...this.config(),
            columnStartIndex: 0,
            columnStopIndex: this.columnStopIndex()
        });
    });

    collapseDisabled = computed(() => {
        const { aiTable } = this.config();
        return aiTable.context!.collapseDisabled();
    });

    collapseClick(e: KoEventObject<MouseEvent>) {
        if (this.collapseDisabled()) {
            e.event.cancelBubble = true;
        }
    }

    groupCells = computed(() => {
        const groups = this.groups();
        const groupCells: {
            collapsedIcon?: AITableIconConfig;
            groupStat?: AITableGroupStatConfig;
        }[] = [];

        groups.forEach((group) => {
            const { row, x = 0, y = 0, height, readonly } = group;
            const { isCollapsed, fieldId, groupId } = row;
            const collapsedIcon: AITableIconConfig | undefined = {
                name: generateTargetName({
                    targetName: AI_TABLE_ROW_GROUP_COLLAPSE_BUTTON,
                    fieldId: fieldId,
                    source: groupId,
                    mouseStyle: readonly ? 'default' : this.collapseDisabled() ? 'not-allowed' : 'pointer'
                }),
                x,
                y: y! + (height - AI_TABLE_ICON_COMMON_SIZE) / 2,
                data: isCollapsed ? AngleRightPath : AngleDownPath
            };
            const groupStats = createGroupFieldStats({
                ...this.config(),
                groupRow: row,
                x,
                y,
                columnStartIndex: 0,
                columnStopIndex: this.columnStopIndex()
            });
            groupStats.forEach((groupStat) => {
                const groupCell: {
                    collapsedIcon?: AITableIconConfig;
                    groupStat?: AITableGroupStatConfig;
                } = {
                    collapsedIcon: undefined,
                    groupStat: undefined
                };
                if (groupStat.columnIndex === 0) {
                    groupCell.collapsedIcon = collapsedIcon;
                }
                groupCell.groupStat = groupStat;
                groupCells.push(groupCell);
            });
        });
        return groupCells;
    });
}
