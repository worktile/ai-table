import { ActionName, VTable, VTableAction, VTableFields, VTableRecords } from '../types';
import { createDraft, finishDraft } from 'immer';

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

const apply = (records: VTableRecords, fields: VTableFields, options: VTableAction) => {
    switch (options.type) {
        case ActionName.AddField: {
            const [fieldIndex] = options.path;
            const newField = options.field;
            fields.splice(fieldIndex, 0, newField);
            const newRecord = {
                [newField.id]: ''
            };
            records.forEach((item) => {
                item.value = {
                    ...item.value,
                    ...newRecord
                };
            });
        }
    }
    return {
        records,
        fields
    };
};

export const GeneralActions = {
    transformRecords(vTable: VTable, op: VTableAction): void {
        const records = createDraft(vTable.records());
        vTable.records.update(() => {
            applyRecords(vTable, records, op);
            return finishDraft(records);
        });
    },
    transform(vTable: VTable, op: VTableAction): void {
        const records = createDraft(vTable.records());
        const fields = createDraft(vTable.fields());
        apply(records, fields, op);
        vTable.fields.update(() => {
            return finishDraft(fields);
        });
        vTable.records.update(() => {
            return finishDraft(records);
        });
    },
    transformView(vTable: VTable, op: VTableAction): void {},
    transformFields(vTable: VTable, op: VTableAction): void {}
};
