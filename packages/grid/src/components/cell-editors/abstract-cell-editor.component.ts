import { ChangeDetectionStrategy, Component, computed, inject, Input, OnInit } from '@angular/core';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { Actions, AITable, AITableField, AITableQueries } from '../../core';

@Component({
    selector: 'abstract-edit-cell',
    template: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class AbstractEditCellEditor<TValue, TFieldType extends AITableField = AITableField> implements OnInit {
    @Input({ required: true }) aiTable!: AITable;

    @Input({ required: true }) fieldId!: string;

    @Input({ required: true }) recordId!: string;

    modelValue!: TValue;

    field = computed(() => {
        return this.aiTable.fieldsMap()[this.fieldId] as TFieldType;
    });

    record = computed(() => {
        return this.aiTable.recordsMap()[this.recordId];
    });

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
