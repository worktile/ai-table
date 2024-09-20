import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StageConfig } from 'konva/lib/Stage';
import {
    AI_TABLE_ACTION_COMMON_SIZE,
    AI_TABLE_CELL_PADDING,
    AI_TABLE_FIELD_HEAD,
    AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE,
    AI_TABLE_FIELD_HEAD_MORE,
    AI_TABLE_FIELD_HEAD_TEXT_MIN_WIDTH,
    AI_TABLE_ICON_COMMON_SIZE,
    AI_TABLE_OFFSET,
    Colors,
    DEFAULT_FONT_SIZE,
    MoreStandOutlinedPath
} from '../../../constants';
import { AITableFieldHeadOptions } from '../../../types';
import { generateTargetName, TextMeasure } from '../../../utils';
import { KoCoreShape } from './core-shape.component';
import { KoFieldIcon } from './field-icon.component';
import { KoIcon } from './icon.component';
import { KoStage } from './stage.component';
import { KoCustomText } from './text.component';

@Component({
    selector: 'ko-field-head',
    template: `
        <ko-group [config]="groupConfig()">
            <ko-rect [config]="rectConfig()"></ko-rect>
            <ko-field-icon [config]="fieldIconConfig()"></ko-field-icon>
            <ko-custom-text [config]="textConfig()"></ko-custom-text>
            @if (config().iconVisible) {
                <ko-icon [options]="moreIconConfig()"></ko-icon>
            }
        </ko-group>
    `,
    standalone: true,
    imports: [KoStage, KoCoreShape, KoFieldIcon, KoCustomText, KoIcon],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KoFieldHead {
    config = input.required<AITableFieldHeadOptions>();

    textOffset = AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE;

    textMeasure = TextMeasure();

    availableTextWidth = computed(() => {
        const { width, iconVisible } = this.config();
        return (
            width -
            (iconVisible
                ? 2 * (AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE)
                : 2 * AI_TABLE_CELL_PADDING + AI_TABLE_ICON_COMMON_SIZE + AI_TABLE_FIELD_HEAD_ICON_GAP_SIZE)
        );
    });

    commonIconOffsetY = computed(() => {
        const { height } = this.config();
        return (height - AI_TABLE_ACTION_COMMON_SIZE) / 2;
    });

    fieldName = computed(() => {
        return this.config().field.name.replace(/\r|\n/g, ' ');
    });

    textData = computed(() => {
        this.textMeasure.setFont({ fontSize: DEFAULT_FONT_SIZE });
        const { width, height, isOverflow } = this.textMeasure.measureText(this.fieldName(), this.availableTextWidth(), 1);
        return {
            width: Math.min(width, this.availableTextWidth()),
            height,
            isOverflow
        };
    });

    groupConfig = computed<Partial<StageConfig>>(() => {
        return {
            x: this.config().x,
            y: this.config().y
        };
    });

    rectConfig = computed(() => {
        const { field, width, height, stroke, isSelected, iconVisible } = this.config();
        return {
            x: AI_TABLE_OFFSET,
            y: AI_TABLE_OFFSET,
            name: generateTargetName({
                targetName: AI_TABLE_FIELD_HEAD,
                fieldId: field._id
            }),
            width: width,
            height: height,
            fill: isSelected ? Colors.itemActiveBgColor : iconVisible ? Colors.gray80 : Colors.white,
            stroke: stroke || Colors.gray200,
            strokeWidth: 1
        };
    });

    fieldIconConfig = computed(() => {
        const { field, height } = this.config();
        return {
            field: field,
            x: AI_TABLE_CELL_PADDING,
            y: (height - AI_TABLE_ICON_COMMON_SIZE) / 2,
            width: AI_TABLE_ICON_COMMON_SIZE,
            height: AI_TABLE_ICON_COMMON_SIZE,
            fill: Colors.gray600
        };
    });

    textConfig = computed(() => {
        const { field, height } = this.config();
        return {
            x: this.textOffset,
            y: undefined,
            width: Math.max(this.textData().width, AI_TABLE_FIELD_HEAD_TEXT_MIN_WIDTH),
            height: height + 2,
            text: field.name,
            lineHeight: 1.84
        };
    });

    moreIconConfig = computed(() => {
        const { field, width, isHoverIcon, isSelected } = this.config();
        return {
            name: generateTargetName({
                targetName: AI_TABLE_FIELD_HEAD_MORE,
                fieldId: field._id
            }),
            x: width - AI_TABLE_CELL_PADDING - AI_TABLE_ACTION_COMMON_SIZE,
            y: this.commonIconOffsetY(),
            data: MoreStandOutlinedPath,
            fill: isHoverIcon ? Colors.primary : Colors.gray600,
            background: isSelected || isHoverIcon ? Colors.itemActiveBgColor : Colors.gray80,
            backgroundWidth: AI_TABLE_ACTION_COMMON_SIZE,
            backgroundHeight: AI_TABLE_ACTION_COMMON_SIZE,
            cornerRadius: 4
        };
    });
}
