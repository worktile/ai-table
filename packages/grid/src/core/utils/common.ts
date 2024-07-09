import { Actions } from '../action';
import { VTable, VTableAction, VTableFields, VTableRecords } from '../types';
import { FLUSHING } from './weak-map';
import { WritableSignal } from '@angular/core';

export function createVTable(
    records: WritableSignal<VTableRecords>,
    fields: WritableSignal<VTableFields>,
): VTable {
    const vTable: VTable = {
        records,
        fields,
        actions: [],
        onChange: () => {},
        apply: (action: VTableAction) => {
            apply(vTable, action, Actions.transform);
        },
        applyFields: (action: VTableAction) => {
            apply(vTable, action, Actions.transformFields);
        },
        applyRecords: (action: VTableAction) => {
            apply(vTable, action, Actions.transformRecords);
        },
        applyView: (action: VTableAction) => {
            apply(vTable, action, Actions.transformView);
        }
    };
    return vTable;
}

function apply(vTable: VTable, action: VTableAction, fn: (vTable: VTable, action: VTableAction) => void) {
    vTable.actions.push(action);
    fn(vTable, action);

    if (!FLUSHING.get(vTable)) {
        FLUSHING.set(vTable, true);
        Promise.resolve().then(() => {
            FLUSHING.set(vTable, false);
            vTable.onChange();
            vTable.actions = [];
        });
    }
}
