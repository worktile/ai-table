import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
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
import { AITableIconOptions } from '../../types';
import { generateTargetName } from '../../utils';
import { KoCoreShape } from './components/core-shape.component';
import { KoIcon } from './components/icon.component';
import { KoStage } from './components/stage.component';

@Component({
    selector: 'ai-table-add-field',
    template: `
        <ko-group
            [config]="{
                x: lastColumnOffset() + lastColumnWidth()
            }"
        >
            <ko-rect [config]="rectConfig()"></ko-rect>
            <ko-icon [options]="addIconOptions()"></ko-icon>
        </ko-group>
    `,
    standalone: true,
    imports: [KoStage, KoCoreShape, KoIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableAddField {
    coordinate = input.required<Coordinate>();

    fields = input.required<AITableField[]>();

    columnStopIndex = input.required<number>();

    lastColumnWidth = computed(() => {
        return this.coordinate().getColumnWidth(this.columnStopIndex());
    });

    lastColumnOffset = computed(() => {
        return this.coordinate().getColumnOffset(this.columnStopIndex());
    });

    x = computed(() => {
        return this.lastColumnOffset() + this.lastColumnWidth();
    });

    offsetY = computed(() => {
        return (this.coordinate().rowInitSize - AI_TABLE_ICON_COMMON_SIZE) / 2;
    });

    btnWidth = AI_TABLE_FIELD_ADD_BUTTON_WIDTH;

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

    addIconOptions = computed<AITableIconOptions>(() => {
        return {
            x: AI_TABLE_CELL_PADDING,
            y: this.offsetY(),
            data: AddOutlinedPath,
            fill: Colors.gray600,
            listening: false
        };
    });
}
