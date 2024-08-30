import { computed, Signal } from '@angular/core';
import { AITableField, AITableFields, AITableRecord, AITableRecords, FieldsMap } from '../core';
import { AITableSizeMap } from '../types';

export function getRecordOrField(value: Signal<AITableRecords | AITableFields>, _id: string): Signal<AITableField | AITableRecord> {
    return computed(() => {
        return value().find((item) => item._id === _id)!;
    });
}

export function getColumnIndicesMap(fields: AITableField[]) {
    const columnIndicesMap: AITableSizeMap = {};
    fields?.forEach((field, index) => {
        columnIndicesMap[index] = field.width ?? FieldsMap[field.type].width;
    });
    return columnIndicesMap;
}
