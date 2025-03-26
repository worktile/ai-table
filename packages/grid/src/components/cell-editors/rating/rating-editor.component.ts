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
    cellMousedown = input<(isSelectCell: boolean) => void>();

    cellMouseup = input<() => void>();

    @HostListener('mousedown', ['$event'])
    mousedownHandler(event: Event) {
        this.handleCellMousedown(event);
        event.preventDefault();
    }

    @HostListener('mouseup', ['$event'])
    mouseupHandler(event: Event) {
        const cellMouseupFn = this.cellMouseup && this.cellMouseup();
        if (cellMouseupFn) {
            cellMouseupFn();
        }
    }

    handleCellMousedown(event: Event) {
        const rateItem = event.target as HTMLElement;
        const cellMousedownFn = this.cellMousedown && this.cellMousedown();
        if (cellMousedownFn) {
            if (rateItem?.classList?.contains('thy-icon')) {
                cellMousedownFn(false);
            } else {
                cellMousedownFn(true);
            }
        }
    }
}
