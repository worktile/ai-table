import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyRate } from 'ngx-tethys/rate';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';

@Component({
    selector: 'rating-cell-editor',
    template: ` <thy-rate [(ngModel)]="modelValue" (ngModelChange)="updateValue()"></thy-rate> `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ThyRate]
})
export class RatingCellEditorComponent extends AbstractEditCellEditor<number> {
    updateValue() {
        this.updateFieldValue();
        this.closePopover();
    }
}
