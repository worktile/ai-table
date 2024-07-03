import { VTableField, VTableRecord, VTableValue } from '@v-table/core';
import { computed, Signal } from '@angular/core';

export function getCellInfo(
    value: Signal<VTableValue>,
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
