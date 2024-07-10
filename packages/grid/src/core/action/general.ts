import { ActionName, VTable, VTableAction, VTableFields, VTableRecords } from '../types';
import { createDraft, finishDraft } from 'immer';

const apply = (vTable: VTable, records: VTableRecords, fields: VTableFields, options: VTableAction) => {
    switch (options.type) {
        case ActionName.UpdateFieldValue: {
            const [recordIndex, fieldIndex] = options.path;
            const fieldId = vTable.fields()[fieldIndex].id;
            records[recordIndex].value[fieldId] = options.newFieldValue;
            break;
        }
        case ActionName.AddRecord: {
            const [recordIndex] = options.path;
            records.splice(recordIndex, 0, options.record);
            break;
        }
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
    transform(vTable: VTable, op: VTableAction): void {
        const records = createDraft(vTable.records());
        const fields = createDraft(vTable.fields());
        apply(vTable, records, fields, op);
        vTable.fields.update(() => {
            return finishDraft(fields);
        });
        vTable.records.update(() => {
            return finishDraft(records);
        });
    }
};
