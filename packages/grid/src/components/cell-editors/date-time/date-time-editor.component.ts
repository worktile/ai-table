import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateEntry, ThyDatePicker } from 'ngx-tethys/date-picker';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';
import { ThyTimePickerModule } from 'ngx-tethys/time-picker';

@Component({
    selector: 'date-time-cell-editor',
    template: `
        <thy-date-picker
            class="h-100"
            thyTimestampPrecision="milliseconds"
            thyPlaceHolder="选择时间"
            [(ngModel)]="modelValue"
            (ngModelChange)="updateValue()"
            (thyOpenChange)="thyOpenChange($event)"
            [thyAllowClear]="true"
            [thyShowShortcut]="true"
            [thyHasBackdrop]="false"
            [thyShowTime]="dateShowTime()"
            [thyOpen]="true"
            [thyFormat]="dateFormat"
        >
        </thy-date-picker>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ThyDatePicker, ThyTimePickerModule],
    host: {
        class: 'date-time-cell-editor'
    }
})
export class DateTimeCellEditorComponent extends AbstractEditCellEditor<DateEntry> {
    dateShowTime = input<boolean>(false);

    dateFormat = computed(() => {
        return this.dateShowTime() ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd';
    })();

    override ngOnInit(): void {
        super.ngOnInit();
        if (!this.modelValue && this.dateShowTime()) {
            this.modelValue = {
                date: 0,
                with_time: 1
            };
        }
    }

    updateValue() {
        this.updateFieldValue();
        this.closePopover();
    }

    thyOpenChange(isOpen: Boolean) {
        if (!isOpen) {
            this.closePopover();
        }
    }
}
