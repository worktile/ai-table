import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KoShape } from '../../../angular-konva/components/shape.component';
import { AI_TABLE_CELL, AI_TABLE_ICON_COMMON_SIZE, AI_TABLE_OFFSET, AI_TABLE_ROW_BLANK_HEIGHT, Colors } from '../../../constants';
import { generateTargetName } from '../../../utils';
import { AITableFieldType, isEmpty } from '@ai-table/utils';
import { CoverCellBase } from './cover-cell-base';
import { KoContainer } from '../../../angular-konva';
import { AITableIcon } from '../icon.component';
import { AITableCheckType } from '../../../types';

@Component({
    selector: 'ai-table-checkbox',
    template: `
        <ko-group>
            <ai-table-icon [config]="checkbox()" (koClick)="switchChecked()"></ai-table-icon>
        </ko-group>
    `,
    imports: [KoContainer, AITableIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableCellCheckbox extends CoverCellBase {
    static override fieldType = AITableFieldType.checkbox;

    isChecked = computed(() => {
        const { render } = this.config()!;
        const { transformValue } = render;
        return !isEmpty(transformValue) && !!transformValue;
    });

    checkbox = computed<any>(() => {
        const { render, field, recordId, readonly } = this.config()!;
        if (render) {
            const { columnWidth } = render;
            const currentX = AI_TABLE_OFFSET + (columnWidth - AI_TABLE_ICON_COMMON_SIZE) / 2;
            let currentY = (AI_TABLE_ROW_BLANK_HEIGHT - AI_TABLE_ICON_COMMON_SIZE) / 2 + AI_TABLE_OFFSET;
            return {
                name: generateTargetName({
                    targetName: AI_TABLE_CELL,
                    fieldId: field._id,
                    recordId,
                    mouseStyle: readonly ? 'default' : 'pointer'
                }),
                x: currentX,
                y: currentY,
                type: this.isChecked() ? AITableCheckType.checked : AITableCheckType.unchecked,
                fill: this.isChecked() ? Colors.primary : Colors.gray300,
                width: AI_TABLE_ICON_COMMON_SIZE,
                height: AI_TABLE_ICON_COMMON_SIZE,
                listening: true
            };
        }

        return null;
    });

    switchChecked() {
        const { actions } = this.config()!;
        actions.updateFieldValues([
            {
                value: !this.isChecked(),
                path: [this.config()!.recordId!, this.config()!.field._id]
            }
        ]);
    }
}
