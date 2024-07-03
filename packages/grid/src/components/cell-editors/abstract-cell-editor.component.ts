import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { Actions, VTable, VTableField, VTableNode, VTableRecord } from '@v-table/core';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { GridCellPath } from '../../types';

@Component({
    selector: 'abstract-cell',
    template: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class AbstractCellEditor<TValue, TFieldType extends VTableField = VTableField> implements OnInit {
    fieldId = input.required<string>();

    field = input.required<TFieldType>();

    record = input.required<VTableRecord>();

    vTable = input.required<VTable>();

    _cellValue = computed(() => {
        return this.record().value[this.fieldId()];
    }, {});

    cellValue!: TValue;

    protected thyPopoverRef = inject(ThyPopoverRef<AbstractCellEditor<TValue>>);

    ngOnInit(): void {
        this.cellValue = this._cellValue();
    }

    updateFieldValue() {
        const path = VTableNode.findPath(this.vTable(), this.field(), this.record()) as GridCellPath;
        Actions.updateFieldValue(this.vTable(), { value: this.cellValue }, path);
    }

    closePopover() {
        this.thyPopoverRef.close();
    }
}
