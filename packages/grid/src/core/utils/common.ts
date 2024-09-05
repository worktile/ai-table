import { WritableSignal, computed, signal } from '@angular/core';
import { Actions } from '../action';
import { AITable, AITableAction, AITableField, AITableFields, AITableRecord, AITableRecords, Path } from '../types';
import { FLUSHING } from './weak-map';

export function createAITable(records: WritableSignal<AITableRecords>, fields: WritableSignal<AITableFields>): AITable {
    const aiTable: AITable = {
        records,
        fields,
        actions: [],
        selection: signal({
            selectedRecords: new Map(),
            selectedFields: new Map(),
            selectedCells: new Map()
        }),
        recordsMap: computed(() => {
            return records().reduce(
                (object, item) => {
                    object[item._id] = item;
                    return object;
                },
                {} as { [kay: string]: AITableRecord }
            );
        }),
        fieldsMap: computed(() => {
            return fields().reduce(
                (object, item) => {
                    object[item._id] = item;
                    return object;
                },
                {} as { [kay: string]: AITableField }
            );
        }),
        onChange: () => {},
        apply: (action: AITableAction) => {
            aiTable.actions.push(action);
            Actions.transform(aiTable, action);

            if (!FLUSHING.get(aiTable)) {
                FLUSHING.set(aiTable, true);
                Promise.resolve().then(() => {
                    FLUSHING.set(aiTable, false);
                    aiTable.onChange();
                    aiTable.actions = [];
                });
            }
        }
    };
    return aiTable;
}

export function isPathEqual(path: Path, another: Path): boolean {
    return path.length === another.length && path.every((n, i) => n === another[i]);
}
