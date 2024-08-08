import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ThyDot } from 'ngx-tethys/dot';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyTag } from 'ngx-tethys/tag';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { AITableField, AITableSelectOption } from '../../../core';
import { AITableSelectOptionStyle, AITableSingleSelectField } from '../../../types';

@Component({
    selector: 'select-option',
    templateUrl: './option.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-flex align-items-center select-option'
    },
    imports: [NgTemplateOutlet, ThyTag, ThyIcon, ThyTooltipModule, ThyDot, ThyFlexibleText]
})
export class SelectOptionComponent {
    field = input.required<AITableField>();

    displayOption = input.required<AITableSelectOption>();

    optionStyle = computed(() => {
        return (this.field() as AITableSingleSelectField).optionStyle || AITableSelectOptionStyle.tag;
    });

    AITableSelectOptionStyle = AITableSelectOptionStyle;
}
