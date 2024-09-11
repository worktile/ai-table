import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyDatePicker } from 'ngx-tethys/date-picker';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';
import { ThyTimePickerModule } from 'ngx-tethys/time-picker';
import { Actions, AITableQueries, DateFieldValue } from '../../../core';

@Component({
    selector: 'date-cell-editor',
    template: `
        <thy-date-picker
            class="h-100"
            thyTimestampPrecision="seconds"
            thyPlaceHolder="选择时间"
            [ngModel]="modelValue.timestamp"
            (ngModelChange)="updateValue($event)"
            (thyOpenChange)="thyOpenChange($event)"
            [thyAllowClear]="true"
            [thyShowShortcut]="true"
            [thyHasBackdrop]="false"
            [thyShowTime]="false"
            [thyOpen]="true"
            thyFormat="yyyy-MM-dd"
        >
        </thy-date-picker>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ThyDatePicker, ThyTimePickerModule],
    host: {
        class: 'date-cell-editor'
    }
})
export class DateCellEditorComponent extends AbstractEditCellEditor<DateFieldValue> {
    override ngOnInit(): void {
        this.modelValue = computed(() => {
            const value = AITableQueries.getFieldValue(this.aiTable, [this.record()._id, this.field()._id]);
            if (!value) {
                return {
                    timestamp: 0
                };
            }
            return value;
        })();
    }

    updateValue(value: number) {
        Actions.updateFieldValue(this.aiTable, { timestamp: value }, [this.record()._id, this.field()._id]);
        this.closePopover();
    }

    thyOpenChange(isOpen: Boolean) {
        if (!isOpen) {
            this.closePopover();
        }
    }
}
