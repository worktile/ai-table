import { Signal, WritableSignal } from '@angular/core';
import { Colors } from '../../constants/colors';
import { AITableSelection } from '../../types';
import { AITableAction } from './action';
import { AITableField, AITableFields, AITableRecord, AITableRecords } from './core';

export interface AITable {
    records: WritableSignal<AITableRecords>;
    fields: WritableSignal<AITableFields>;
    actions: AITableAction[];
    selection: WritableSignal<AITableSelection>;
    recordsMap: Signal<{ [kay: string]: AITableRecord }>;
    fieldsMap: Signal<{ [kay: string]: AITableField }>;
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
    },
    getVisibleRows(aiTable: AITable) {
        return aiTable.records();
    }
};
