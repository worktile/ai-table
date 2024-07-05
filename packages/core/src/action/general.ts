import { ActionName, VTable, VTableAction, VTableFields, VTableRecords } from '../types';
import { createDraft, finishDraft } from 'immer';

const applyFields = (vTable: VTable, fields: VTableFields, options: VTableAction) => {};

const applyRecords = (vTable: VTable, records: VTableRecords, options: VTableAction) => {
    switch (options.type) {
        case ActionName.UpdateFieldValue: {
            const [recordIndex, fieldIndex] = options.path;
            const fieldId = vTable.fields()[fieldIndex].id;
            records[recordIndex].value[fieldId] = options.newProperties.value;
            break;
        }
        case ActionName.AddRecord: {
            const [recordIndex] = options.path;
            records.splice(recordIndex, 0, options.record);
            break;
        }
    }
};

export const GeneralActions = {
    transformRecords(vTable: VTable, op: VTableAction): void {
        vTable.records.update((records) => {
            const value = createDraft(records);
            applyRecords(vTable, value, op);
            return finishDraft(value);
        });
    },
    transformFields(vTable: VTable, op: VTableAction): void {
        vTable.fields.update((fields) => {
            const value = createDraft(fields);
            applyFields(vTable, value, op);
            return finishDraft(value);
        });
    },
    transformView(vTable: VTable, op: VTableAction): void {},
    transform(vTable: VTable, op: VTableAction): void {}
};
