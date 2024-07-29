import { ActionName, AITable, AITableAction, AITableFields, AITableRecords } from '../types';
import { createDraft, finishDraft } from 'immer';

const apply = (aiTable: AITable, records: AITableRecords, fields: AITableFields, options: AITableAction) => {
    switch (options.type) {
        case ActionName.UpdateFieldValue: {
            const [recordIndex, fieldIndex] = options.path;
            if (fieldIndex > -1 && recordIndex > -1) {
                const fieldId = aiTable.fields()[fieldIndex].id;
                records[recordIndex].value[fieldId] = options.newFieldValue;
            }
            break;
        }
        case ActionName.AddRecord: {
            const [recordIndex] = options.path;
            if (recordIndex > -1) {
                records.splice(recordIndex, 0, options.record);
            }
            break;
        }
        case ActionName.AddField: {
            const [fieldIndex] = options.path;
            if (fieldIndex > -1) {
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

            break;
        }
        case ActionName.RemoveField: {
            const [fieldIndex] = options.path;
            if (fieldIndex > -1) {
                const fieldId = aiTable.fields()[fieldIndex].id;
                fields.splice(fieldIndex, 1);
                records.forEach((item) => {
                    delete item.value[fieldId];
                });
            }
            break;
        }
        case ActionName.RemoveRecord: {
            const [recordIndex] = options.path;
            if (recordIndex > -1) {
                records.splice(recordIndex, 1);
            }
            break;
        }
    }
    return {
        records,
        fields
    };
};

export const GeneralActions = {
    transform(aiTable: AITable, op: AITableAction): void {
        const records = createDraft(aiTable.records());
        const fields = createDraft(aiTable.fields());
        apply(aiTable, records, fields, op);
        aiTable.fields.update(() => {
            return finishDraft(fields);
        });
        aiTable.records.update(() => {
            return finishDraft(records);
        });
    }
};
