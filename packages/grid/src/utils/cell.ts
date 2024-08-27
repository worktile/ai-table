import { computed, Signal } from '@angular/core';
import { AITableField, AITableFields, AITableRecord, AITableRecords } from '../core';
import { AITableSizeMap } from '../types';
import { AI_TABLE_DEFAULT_COLUMN_WIDTH } from '../constants';

export function getRecordOrField(value: Signal<AITableRecords | AITableFields>, _id: string): Signal<AITableField | AITableRecord> {
    return computed(() => {
        return value().find((item) => item._id === _id)!;
    });
}

export function getColumnIndicesMap(fields: AITableField[]) {
    const columnIndicesMap: AITableSizeMap = {};
    fields?.forEach((field, index) => {
        columnIndicesMap[index] = field.width ?? AI_TABLE_DEFAULT_COLUMN_WIDTH;
    });
    return columnIndicesMap;
}
