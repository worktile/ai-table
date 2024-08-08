import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ThyTag } from 'ngx-tethys/tag';
import { AITableField, AITableRecord, AITableSelectOption } from '../../../core';
import { SelectOptionPipe } from '../../../pipes';
import { AITableSelectOptionStyle, AITableSingleSelectField } from '../../../types';
import { SelectCellViewComponent } from './select-view.component';

@Component({
    selector: 'multi-select-view',
    templateUrl: './multi-select-view.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-flex multi-select-view'
    },
    imports: [ThyTag, SelectCellViewComponent, SelectOptionPipe],
    providers: [SelectOptionPipe]
})
export class MultiSelectViewComponent {
    field = input.required<AITableField>();

    record = input.required<AITableRecord>();

    AITableSelectOptionStyle = AITableSelectOptionStyle;

    maxShowCount = 2;

    private selectOptionPipe = inject(SelectOptionPipe);

    selectedOptions = computed<AITableSelectOption[]>(() => {
        const values = this.record().values[this.field()._id] ?? [];
        return values.map((id: string) => {
            return this.selectOptionPipe.transform(id, (this.field() as AITableSingleSelectField).options);
        });
    });

    optionStyle = computed(() => {
        return (this.field() as AITableSingleSelectField).optionStyle || AITableSelectOptionStyle.tag;
    });

    tagShape = computed(() => {
        return this.optionStyle() === AITableSelectOptionStyle.tag ? 'pill' : 'rectangle';
    });
}
