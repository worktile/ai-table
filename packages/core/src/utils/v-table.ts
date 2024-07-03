import { Actions } from '../action';
import { VTable, VTableAction, VTableRecord, VTableValue } from '../types';
import { idCreator } from './id-creator';
import { getDefaultValueByType } from './view';
import { FLUSHING } from './weak-map';
import { WritableSignal } from '@angular/core';

export function createVTable(value: WritableSignal<VTableValue>): VTable {
    const vTable: VTable = {
        value,
        actions: [],
        apply: (operation: VTableAction) => {
            vTable.actions.push(operation);
            Actions.transform(vTable, operation);
            if (!FLUSHING.get(vTable)) {
                FLUSHING.set(vTable, true);
                Promise.resolve().then(() => {
                    FLUSHING.set(vTable, false);
                    vTable.actions = [];
                });
            }
        }
    };
    return vTable;
}

export function getDefaultRecord(value: VTableValue) {
    const newRow: VTableRecord = {
        id: idCreator(),
        value: {}
    };
    value.fields.map((item) => {
        newRow.value[item.id] = getDefaultValueByType(item.type);
    });
    return newRow;
}
