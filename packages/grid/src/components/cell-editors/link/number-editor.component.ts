import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyInputNumber } from 'ngx-tethys/input-number';
import { ThyAutofocusDirective, ThyEnterDirective } from 'ngx-tethys/shared';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';

@Component({
    selector: 'link-cell-editor',
    template: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ThyAutofocusDirective, ThyEnterDirective, ThyInputNumber]
})
export class LinkCellEditorComponent extends AbstractEditCellEditor<number> {
    updateValue() {
        this.updateFieldValue();
        this.closePopover();
    }
}
