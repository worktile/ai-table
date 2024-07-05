import { VTableField, VTableFields, VTableRecord, VTableRecords } from '@v-table/core';
import { computed, Signal } from '@angular/core';

export function getRecordOrField(value: Signal<VTableRecords | VTableFields>, id: string): Signal<VTableField | VTableRecord> {
    return computed(() => {
        return value().find((item) => item.id === id)!;
    });
}
