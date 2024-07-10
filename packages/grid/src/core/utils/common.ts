import { Actions } from '../action';
import { VTable, VTableAction, VTableFields, VTableRecords } from '../types';
import { FLUSHING } from './weak-map';
import { WritableSignal } from '@angular/core';

export function createVTable(records: WritableSignal<VTableRecords>, fields: WritableSignal<VTableFields>): VTable {
    const vTable: VTable = {
        records,
        fields,
        actions: [],
        onChange: () => {},
        apply: (action: VTableAction) => {
            vTable.actions.push(action);
            Actions.transform(vTable, action);

            if (!FLUSHING.get(vTable)) {
                FLUSHING.set(vTable, true);
                Promise.resolve().then(() => {
                    FLUSHING.set(vTable, false);
                    vTable.onChange();
                    vTable.actions = [];
                });
            }
        }
    };
    return vTable;
}
