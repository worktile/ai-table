import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import { KoContainer, KoShape, KoStage } from '../../angular-konva';
import {
    AddOutlinedPath,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_ADD_BUTTON,
    AI_TABLE_FIELD_ADD_BUTTON_WIDTH,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    Colors
} from '../../constants';
import { AITableField, Coordinate } from '../../core';
import { AITableIconConfig } from '../../types';
import { generateTargetName } from '../../utils';
import { AITableIcon } from './icon.component';

@Component({
    selector: 'ai-table-add-field',
    template: `
        <ko-group [config]="{ x: x() }">
            <ko-rect [config]="rectConfig()"></ko-rect>
            <ai-table-icon [config]="addIconConfig()"></ai-table-icon>
        </ko-group>
    `,
    standalone: true,
    imports: [KoContainer, KoStage, KoShape, AITableIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableAddField {
    coordinate = input.required<Coordinate>();

    fields = input.required<AITableField[]>();

    columnStopIndex = input.required<number>();

    btnWidth = AI_TABLE_FIELD_ADD_BUTTON_WIDTH;

    x = computed(() => {
        const lastColumnWidth = this.coordinate().getColumnWidth(this.columnStopIndex());
        const lastColumnOffset = this.coordinate().getColumnOffset(this.columnStopIndex());
        return lastColumnWidth + lastColumnOffset;
    });

    rectConfig = computed<Partial<StageConfig>>(() => {
        return {
            name: generateTargetName({
                targetName: AI_TABLE_FIELD_ADD_BUTTON,
                fieldId: this.fields()[this.columnStopIndex()]._id,
                mouseStyle: 'pointer'
            }),
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            width:
                this.coordinate().containerWidth - this.x() < this.btnWidth ? this.btnWidth : this.coordinate().containerWidth - this.x(),
            height: this.coordinate().rowInitSize,
            stroke: Colors.gray200,
            strokeWidth: 1,
            listening: true
        };
    });

    addIconConfig = computed<AITableIconConfig>(() => {
        const offsetY = (this.coordinate().rowInitSize - AI_TABLE_ICON_COMMON_SIZE) / 2;
        return {
            x: AI_TABLE_CELL_PADDING,
            y: offsetY,
            data: AddOutlinedPath,
            fill: Colors.gray600,
            listening: false
        };
    });
}
