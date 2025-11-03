import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer, KoShape } from '../../angular-konva';
import {
    AddOutlinedPath,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_ADD_BUTTON,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_FIELD_HEAD_HEIGHT,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    Colors
} from '../../constants';
import { AITableAddFieldConfig, AITableIconConfig } from '../../types';
import { generateTargetName } from '../../utils';
import { AITableIcon } from './icon.component';

@Component({
    selector: 'ai-table-add-field',
    template: `
        <ko-group [config]="{ x: x() }">
            <ko-group>
                <ko-rect [config]="rectConfig()"></ko-rect>
            </ko-group>
            <ko-group>
                @if (addIconConfig().visible) {
                    <ai-table-icon [config]="addIconConfig()"></ai-table-icon>
                }
            </ko-group>
        </ko-group>
    `,
    imports: [KoContainer, KoShape, AITableIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableAddField {
    config = input.required<AITableAddFieldConfig>();

    btnWidth = AI_TABLE_FIELD_ADD_BUTTON_WIDTH;

    x = computed(() => {
        const lastColumnWidth = this.config().coordinate.getColumnWidth(this.config().columnStopIndex);
        const lastColumnOffset = this.config().coordinate.getColumnOffset(this.config().columnStopIndex);
        return lastColumnWidth + lastColumnOffset;
    });

    rectConfig = computed<Partial<StageConfig>>(() => {
        const {
            pointPosition: { targetName },
            readonly,
            maxFields,
            aiTable
        } = this.config();
        const fill = targetName === AI_TABLE_FIELD_ADD_BUTTON ? Colors.gray80 : Colors.white;
        const fields = this.config().fields || [];
        const index = this.config().columnStopIndex;
        const fieldId = fields.length && index < fields.length ? fields[index]._id : '';
        const disabled = maxFields && aiTable.fields().length >= maxFields;
        return {
            name: generateTargetName({
                targetName: AI_TABLE_FIELD_ADD_BUTTON,
                fieldId,
                mouseStyle: readonly || disabled ? 'default' : 'pointer'
            }),
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            width:
                this.config().coordinate.containerWidth - this.x() < this.btnWidth
                    ? this.btnWidth
                    : this.config().coordinate.containerWidth - this.x(),
            height: AI_TABLE_FIELD_HEAD_HEIGHT,
            stroke: Colors.gray200,
            strokeWidth: 1,
            listening: true,
            fill
        };
    });

    addIconConfig = computed<AITableIconConfig>(() => {
        const { readonly, maxFields, aiTable } = this.config();
        const offsetY = (AI_TABLE_FIELD_HEAD_HEIGHT - AI_TABLE_ICON_COMMON_SIZE) / 2;
        return {
            x: AI_TABLE_CELL_PADDING,
            y: offsetY,
            data: AddOutlinedPath,
            fill: Colors.gray600,
            listening: false,
            visible: !readonly,
            disabled: maxFields ? aiTable.fields().length >= maxFields : false
        };
    });
}
