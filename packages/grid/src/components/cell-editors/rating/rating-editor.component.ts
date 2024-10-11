import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyRate } from 'ngx-tethys/rate';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';

@Component({
    selector: 'rating-cell-editor',
    template: ` <thy-rate [(ngModel)]="modelValue" (ngModelChange)="update()"></thy-rate> `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ThyRate],
    host: {
        class: 'd-flex align-items-center h-100 rating-cell-editor'
    }
})
export class RatingCellEditorComponent extends AbstractEditCellEditor<number> {}
