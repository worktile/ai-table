import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { AITable, AITableField, AITableFields, AITableRecord, AITableRecords, AITableValue } from '../types';
import { AITableSelectAllState } from '../../types';

export function createAITable(records: WritableSignal<AITableRecords>, fields: WritableSignal<AITableFields>, gridData: Signal<AITableValue>): AITable {
    const aiTable: AITable = {
        records,
        fields,
        gridData,
        selection: signal({
            selectedRecords: new Set(),
            selectedFields: new Set(),
            selectedCells: new Set(),
            activeCell: null,
            selectAllState: AITableSelectAllState.none
        }),
        keywordsMatchedCells: signal(new Set()),
        recordsMap: computed(() => {
            return records().reduce(
                (object, item) => {
                    object[item._id] = item;
                    return object;
                },
                {} as { [key: string]: AITableRecord }
            );
        }),
        fieldsMap: computed(() => {
            return fields().reduce(
                (object, item) => {
                    object[item._id] = item;
                    return object;
                },
                {} as { [key: string]: AITableField }
            );
        }),
        recordsWillHidden: signal([]),
        recordsWillMove: signal([])
    };
    return aiTable;
}
