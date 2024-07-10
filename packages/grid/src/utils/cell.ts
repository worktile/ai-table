import { computed, Signal } from '@angular/core';
import { AITableField, AITableFields, AITableRecord, AITableRecords } from '../core';

export function getRecordOrField(value: Signal<AITableRecords | AITableFields>, id: string): Signal<AITableField | AITableRecord> {
    return computed(() => {
        return value().find((item) => item.id === id)!;
    });
}
