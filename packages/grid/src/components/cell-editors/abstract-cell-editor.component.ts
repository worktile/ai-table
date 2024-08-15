import { ChangeDetectionStrategy, Component, computed, inject, Input, input, OnInit } from '@angular/core';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { Actions, AIFieldValuePath, AITable, AITableField, AITableQueries, AITableRecord } from '../../core';

@Component({
    selector: 'abstract-edit-cell',
    template: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class AbstractEditCellEditor<TValue, TFieldType extends AITableField = AITableField> implements OnInit {
    field = input.required<TFieldType>();

    record = input.required<AITableRecord>();

    @Input({ required: true }) aiTable!: AITable;

    modelValue!: TValue;

    protected thyPopoverRef = inject(ThyPopoverRef<AbstractEditCellEditor<TValue>>);

    ngOnInit(): void {
        this.modelValue = computed(() => {
            return AITableQueries.getFieldValue(this.aiTable, [this.record()._id, this.field()._id]);
        })();
    }

    updateFieldValue() {
        Actions.updateFieldValue(this.aiTable, this.modelValue, [this.record()._id, this.field()._id]);
    }

    closePopover() {
        this.thyPopoverRef?.close();
    }
}
