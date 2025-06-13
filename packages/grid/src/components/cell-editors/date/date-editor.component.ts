import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyDatePicker } from 'ngx-tethys/date-picker';
import { AbstractEditCellEditor } from '../abstract-cell-editor.component';
import { ThyTimePickerModule } from 'ngx-tethys/time-picker';
import { AITableQueries } from '../../../core';
import { AITableGridI18nKey, getI18nTextByKey } from '../../../utils/i18n';
import { DateFieldValue } from '@ai-table/utils';

@Component({
    selector: 'date-cell-editor',
    template: `
        <thy-date-picker
            class="h-100"
            thyTimestampPrecision="seconds"
            [thyPlaceHolder]="placeholder"
            [ngModel]="modelValue && modelValue.timestamp"
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ThyDatePicker, ThyTimePickerModule],
    host: {
        class: 'date-cell-editor'
    }
})
export class DateCellEditorComponent extends AbstractEditCellEditor<DateFieldValue> {
    placeholder = '';

    override ngOnInit(): void {
        this.modelValue = (() => {
            const value = AITableQueries.getFieldValue(this.aiTable, [this.record()._id, this.field()._id]);
            if (!value) {
                return {
                    timestamp: 0
                };
            }
            return value;
        })();
        this.placeholder = getI18nTextByKey(this.aiTable, AITableGridI18nKey.dataPickerPlaceholder);
    }

    updateValue(value: number) {
        this.updateFieldValues.emit([
            {
                value: { timestamp: value },
                path: [this.record()._id, this.field()._id]
            }
        ]);
        this.closePopover();
    }

    thyOpenChange(isOpen: Boolean) {
        if (!isOpen) {
            this.closePopover();
        }
    }
}
