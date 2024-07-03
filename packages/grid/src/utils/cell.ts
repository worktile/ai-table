import { VTableField, VTableRecord } from '@v-table/core';
import { GridData } from '../types';
import { computed, Signal } from '@angular/core';

export function getCellInfo(
    value: Signal<GridData>,
    fieldId: string,
    recordId: string
): {
    field: Signal<VTableField>;
    record: Signal<VTableRecord>;
} {
    const field = computed(() => {
        return value().fields.find((item) => item.id === fieldId)!;
    });
    const record = computed(() => {
        return value().records.find((item) => item.id === recordId)!;
    });
    return {
        field,
        record
    };
}
