import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThySelect } from 'ngx-tethys/select';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';
import { ThyTag } from 'ngx-tethys/tag';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyOption } from 'ngx-tethys/shared';
import { AITableSelectOption, AITableField } from '../../../core';

export interface AITableSingleSelectField extends AITableField<AITableSelectOption> {
    options: AITableSelectOption[];
}

@Component({
    selector: 'single-select-cell-editor',
    template: `<thy-select [(ngModel)]="modelValue" [thyAutoExpand]="true" (thyOnExpandStatusChange)="updateValue($event)">
        <thy-option *ngFor="let option of selectOptions()" [thyValue]="option._id" [thyLabelText]="option.text"> </thy-option>
    </thy-select> `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block h-100'
    },
    imports: [NgIf, NgForOf, FormsModule, ThySelect, ThyOption, ThyTag, ThyIcon]
})
export class SelectCellEditorComponent extends AbstractEditCellEditor<string, AITableSingleSelectField> {
    @Input() isMultiple!: boolean;

    selectOptions = computed(() => {
        return this.field().options;
    });

    constructor() {
        super();
    }

    updateValue(value: boolean) {
        if (!value) {
            this.updateFieldValue();
            this.closePopover();
        }
    }
}
