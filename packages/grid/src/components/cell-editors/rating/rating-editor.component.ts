import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';
import { ThyRate } from 'ngx-tethys/rate';
import { ThyTooltipModule } from 'ngx-tethys/tooltip';

@Component({
    selector: 'rating-cell-editor',
    template: ` <thy-rate [(ngModel)]="modelValue" (ngModelChange)="updateValue()"></thy-rate> `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ThyRate, ThyTooltipModule]
})
export class RatingCellEditorComponent extends AbstractEditCellEditor<number> {
    updateValue() {
        this.updateFieldValue();
        this.closePopover();
    }
}
