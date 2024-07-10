import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { GridCellPath } from '../../types';
import { Actions, VTable, VTableField, VTableQueries, VTableRecord } from '../../core';

@Component({
    selector: 'abstract-edit-cell',
    template: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class AbstractEditCellEditor<TValue, TFieldType extends VTableField = VTableField> implements OnInit {
    field = input.required<TFieldType>();

    record = input.required<VTableRecord>();

    vTable = input.required<VTable>();

    modelValue!: TValue;

    protected thyPopoverRef = inject(ThyPopoverRef<AbstractEditCellEditor<TValue>>);

    ngOnInit(): void {
        this.modelValue = computed(() => {
            const path = VTableQueries.findPath(this.vTable(), this.field(), this.record()) as GridCellPath;
            return VTableQueries.getFieldValue(this.vTable(), path);
        })();
    }

    updateFieldValue() {
        const path = VTableQueries.findPath(this.vTable(), this.field(), this.record()) as GridCellPath;
        Actions.updateFieldValue(this.vTable(), this.modelValue, path);
    }

    closePopover() {
        this.thyPopoverRef.close();
    }
}
