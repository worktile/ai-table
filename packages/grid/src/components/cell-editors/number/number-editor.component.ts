import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyInputNumber } from 'ngx-tethys/input-number';
import { ThyAutofocusDirective, ThyEnterDirective } from 'ngx-tethys/shared';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';

@Component({
    selector: 'number-cell-editor',
    template: `
        <thy-input-number
            class="h-100"
            [thyAutoFocus]="true"
            [(ngModel)]="modelValue"
            (thyEnter)="updateValue()"
            (thyBlur)="updateValue()"
            placeholder=""
        />
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ThyAutofocusDirective, ThyEnterDirective, ThyInputNumber]
})
export class NumberCellEditorComponent extends AbstractEditCellEditor<number> {
    updateValue() {
        this.updateFieldValue();
        this.closePopover();
    }
}
