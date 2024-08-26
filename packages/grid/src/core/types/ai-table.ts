import { WritableSignal } from '@angular/core';
import { Colors } from '../../constants';
import { AITableSelection } from '../../types';
import { AITableAction } from './action';
import { AITableFields, AITableRecords } from './core';

export interface AITable {
    records: WritableSignal<AITableRecords>;
    fields: WritableSignal<AITableFields>;
    actions: AITableAction[];
    selection: WritableSignal<AITableSelection>;
    onChange: () => void;
    apply: (action: AITableAction) => void;
}

export type AIPlugin = (aiTable: AITable) => AITable;

export const AITable = {
    getColors() {
        return Colors;
    },
    getVisibleFields(aiTable: AITable) {
        return aiTable.fields().filter((field) => !field.hidden);
    }
};
