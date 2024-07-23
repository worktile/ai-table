import { AICustomAction } from '../../types';
import { Actions } from '../action';
import { AITable, AITableAction, AITableFields, AITableRecords } from '../types';
import { FLUSHING } from './weak-map';
import { WritableSignal } from '@angular/core';

export function createAITable(
    records: WritableSignal<AITableRecords>,
    fields: WritableSignal<AITableFields>,
    aiCustomAction?: AICustomAction
): AITable {
    const aiTable: AITable = {
        records,
        fields,
        actions: [],
        onChange: () => {},
        apply: (action: AITableAction) => {
            aiTable.actions.push(action);
            Actions.transform(aiTable, action, aiCustomAction);

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
