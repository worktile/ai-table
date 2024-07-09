import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThySelect } from 'ngx-tethys/select';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';
import { ThyTag } from 'ngx-tethys/tag';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyOption } from 'ngx-tethys/shared';
import { SelectOption, VTableField } from '@v-table/core';

export interface VTableSingleSelectField extends VTableField {
    options: SelectOption[];
}

@Component({
    selector: 'single-select-cell-editor',
    template: `<thy-select [(ngModel)]="cellValue" [thyAutoExpand]="true" (thyOnExpandStatusChange)="updateValue($event)">
        <thy-option *ngFor="let option of selectOptions()" [thyValue]="option.id" [thyLabelText]="option.name"> </thy-option>
    </thy-select> `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block h-100'
    },
    imports: [NgIf, NgForOf, FormsModule, ThySelect, ThyOption, ThyTag, ThyIcon]
})
export class SingleSelectCellEditorComponent extends AbstractEditCellEditor<string, VTableSingleSelectField> {
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
