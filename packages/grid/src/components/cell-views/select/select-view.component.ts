import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ThyTag } from 'ngx-tethys/tag';
import { AITableField, AITableSelectOption } from '../../../core';
import { AITableSelectOptionStyle, AITableSingleSelectField } from '../../../types';
import { SelectOptionComponent } from './option.component';

@Component({
    selector: 'select-cell-view',
    templateUrl: './select-view.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-flex select-cell-view',
        '[class.mb-1]': 'optionStyle() === AITableSelectOptionStyle.tag',
        '[class.mr-1]': 'optionStyle() === AITableSelectOptionStyle.tag'
    },
    imports: [ThyTag, SelectOptionComponent]
})
export class SelectCellViewComponent {
    field = input.required<AITableField>();

    displayOption = input.required<AITableSelectOption>();

    optionStyle = computed(() => {
        return (this.field() as AITableSingleSelectField).optionStyle || AITableSelectOptionStyle.tag;
    });

    AITableSelectOptionStyle = AITableSelectOptionStyle;

    maxShowCount = 2;
}
