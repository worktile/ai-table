import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ThyDot } from 'ngx-tethys/dot';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyTag } from 'ngx-tethys/tag';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';
import { AITableField, AITableSelectOption, AITableSelectOptionStyle } from '../../../core';
import { AITableSelectField } from '../../../types';
@Component({
    selector: 'select-option',
    templateUrl: './option.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-flex align-items-center select-option'
    },
    imports: [ThyTag, ThyIcon, ThyTooltipModule, ThyDot, ThyFlexibleText]
})
export class SelectOptionComponent {
    field = input.required<AITableField>();

    defaultColor = '#f5f5f5';

    displayOption = input.required<AITableSelectOption>();

    optionStyle = computed(() => {
        return (this.field() as AITableSelectField).settings.option_style || AITableSelectOptionStyle.tag;
    });

    AITableSelectOptionStyle = AITableSelectOptionStyle;
}
