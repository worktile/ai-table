import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyInputNumber } from 'ngx-tethys/input-number';
import { ThyEnterDirective } from 'ngx-tethys/shared';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';
import { FieldModelMap } from '../../../utils';
import { NumberFieldValue } from '@ai-table/utils';

@Component({
    selector: 'number-cell-editor',
    template: `<thy-input-number
        class="h-100"
        [thyAutoFocus]="autoFocus()"
        [(ngModel)]="modelValue"
        (thyEnter)="updateValue()"
        (thyBlur)="updateValue()"
    /> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ThyEnterDirective, ThyInputNumber],
    host: {
        class: 'number-cell-editor'
    }
})
export class NumberCellEditorComponent extends AbstractEditCellEditor<NumberFieldValue> {
    updateValue() {
        if ((this.modelValue as unknown as string) === '') {
            const fieldModel = FieldModelMap[this.field().type];
            this.modelValue = fieldModel.transformCellValue(this.modelValue, { aiTable: this.aiTable, field: this.field() });
        }
        super.update();
        this.closePopover();
    }
}
