import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { GridCellPath } from '../../types';
import { Actions, AITable, AITableField, AITableQueries, AITableRecord } from '../../core';

@Component({
    selector: 'abstract-edit-cell',
    template: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class AbstractEditCellEditor<TValue, TFieldType extends AITableField = AITableField> implements OnInit {
    field = input.required<TFieldType>();

    record = input.required<AITableRecord>();

    aiTable = input.required<AITable>();

    modelValue!: TValue;

    protected thyPopoverRef = inject(ThyPopoverRef<AbstractEditCellEditor<TValue>>);

    ngOnInit(): void {
        this.modelValue = computed(() => {
            const path = AITableQueries.findPath(this.aiTable(), this.field(), this.record()) as GridCellPath;
            return AITableQueries.getFieldValue(this.aiTable(), path);
        })();
    }

    updateFieldValue() {
        const path = AITableQueries.findPath(this.aiTable(), this.field(), this.record()) as GridCellPath;
        Actions.updateFieldValue(this.aiTable(), this.modelValue, path);
    }

    closePopover() {
        this.thyPopoverRef.close();
    }
}
