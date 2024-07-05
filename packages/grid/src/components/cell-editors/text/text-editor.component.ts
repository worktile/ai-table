import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyAutofocusDirective, ThyEnterDirective } from 'ngx-tethys/shared';
import { AbstractCellEditor } from '../abstract-cell-editor.component';

@Component({
    selector: 'text-cell-editor',
    template: `<input thyInput [thyAutofocus]="true" [(ngModel)]="cellValue" (thyEnter)="updateValue()" placeholder="" /> `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, FormsModule, ThyAutofocusDirective, ThyInputDirective, ThyEnterDirective]
})
export class TextCellEditorComponent extends AbstractCellEditor<string> {
    updateValue() {
        this.updateFieldValue();
        this.closePopover();
    }
}
