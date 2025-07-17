import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { AITableField, AITableFields, AITableRecord, AITableRecords, AITableValue, DragType } from '@ai-table/utils';
import { AITableSelectAllState } from '../../types';
import { AITable } from '../types';

export function createAITable(
    records: WritableSignal<AITableRecords>,
    fields: WritableSignal<AITableFields>,
    gridData: Signal<AITableValue>
): AITable {
    const aiTable: AITable = {
        records,
        fields,
        gridData,
        selection: signal({
            selectedRecords: new Set(),
            selectedFields: new Set(),
            selectedCells: new Set(),
            activeCell: null,
            expandCell: null,
            editingCell: null,
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
        recordsWillMove: signal([]),
        dragState: signal({
            type: DragType.none,
            sourceIds: new Set()
        })
    };
    return aiTable;
}

export function generateNewName(existNames: string[], count: number, name: string) {
    let newName = name;
    let suffix = count;

    if (count > 1) {
        newName = `${name} ${suffix}`;
    }

    while (existNames.includes(newName)) {
        suffix++;
        newName = `${name} ${suffix}`;
    }
    return newName;
}
