import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AITableCellsConfig, AITableIconConfig } from '../../../types';
import { createGroupCells } from '../../creations/create-group-options';
import { generateTargetName } from '../../../utils';
import { AI_TABLE_ICON_COMMON_SIZE, AI_TABLE_ROW_GROUP_COLLAPSE_BUTTON, AngleDownPath, AngleRightPath } from '../../../constants';
import { AITableIcon } from '../icon.component';

@Component({
    selector: 'ai-table-frozen-groups',
    template: `
        @for (collapsedIcon of groupFirstColumnCollapsedIcons(); track $index) {
            <ai-table-icon [config]="collapsedIcon"></ai-table-icon>
        }
    `,
    imports: [CommonModule, AITableIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFrozenGroups {
    config = input.required<AITableCellsConfig>();

    groupOptions = computed(() => {
        const { coordinate } = this.config();
        const { frozenColumnCount } = coordinate;
        return createGroupCells({
            ...this.config(),
            columnStartIndex: 0,
            columnStopIndex: frozenColumnCount - 1
        });
    });

    groupFirstColumnCollapsedIcons = computed(() => {
        const groupOptions = this.groupOptions();
        const collapsedIcons: AITableIconConfig[] = [];
        groupOptions.forEach((groupOption) => {
            const { row, x, y, height, columnIndex, readonly } = groupOption;
            if (columnIndex === 0) {
                const { isCollapsed, fieldId, groupId } = row;
                collapsedIcons.push({
                    name: generateTargetName({
                        targetName: AI_TABLE_ROW_GROUP_COLLAPSE_BUTTON,
                        fieldId: fieldId,
                        source: groupId,
                        mouseStyle: readonly ? 'default' : 'pointer'
                    }),
                    x,
                    y: y! + (height - AI_TABLE_ICON_COMMON_SIZE) / 2,
                    data: isCollapsed ? AngleRightPath : AngleDownPath
                });
            }
        });
        return collapsedIcons;
    });
}
