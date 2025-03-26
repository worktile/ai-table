import { ChangeDetectionStrategy, Component, HostListener, input } from '@angular/core';
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
        class: 'd-flex align-items-center h-100 rating-cell-editor ai-table-prevent-clear-selection'
    }
})
export class RatingCellEditorComponent extends AbstractEditCellEditor<number> {
    mousedownCell = input<(isSelectCell: boolean) => void>();

    @HostListener('mousedown', ['$event'])
    mousedownHandler(event: Event) {
        this.handleMousedownCell(event);
        event.preventDefault();
    }

    handleMousedownCell(event: Event) {
        const rateItem = event.target as HTMLElement;
        const mousedownCellFn = this.mousedownCell && this.mousedownCell();
        if (mousedownCellFn) {
            if (rateItem?.classList?.contains('thy-icon')) {
                mousedownCellFn(false);
            } else {
                mousedownCellFn(true);
            }
        }
    }
}
