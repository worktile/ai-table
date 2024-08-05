import { ActionName, AITable, AITableAction, AITableFields, AITableRecords } from '../types';
import { createDraft, finishDraft } from 'immer';
import { isPathEqual } from '../utils';

const apply = (aiTable: AITable, records: AITableRecords, fields: AITableFields, options: AITableAction) => {
    switch (options.type) {
        case ActionName.UpdateFieldValue: {
            const [recordIndex, fieldIndex] = options.path;
            if (fieldIndex > -1 && recordIndex > -1) {
                const fieldId = aiTable.fields()[fieldIndex]._id;
                records[recordIndex].values[fieldId] = options.newFieldValue;
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
                    [newField._id]: ''
                };
                records.forEach((item) => {
                    item.values = {
                        ...item.values,
                        ...newRecord
                    };
                });
            }

            break;
        }
        case ActionName.MoveRecord: {
            if (isPathEqual(options.path, options.newPath)) {
                return;
            }
            const record = records[options.path[0]];
            records.splice(options.path[0], 1);
            records.splice(options.newPath[0], 0, record);
            break;
        }
        case ActionName.MoveField: {
            if (isPathEqual(options.path, options.newPath)) {
                return;
            }
            const field = fields[options.path[0]];
            fields.splice(options.path[0], 1);
            fields.splice(options.newPath[0], 0, field);

            break;
        }
        case ActionName.RemoveField: {
            const [fieldIndex] = options.path;
            if (fieldIndex > -1) {
                const fieldId = aiTable.fields()[fieldIndex]._id;
                fields.splice(fieldIndex, 1);
                records.forEach((item) => {
                    delete item.values[fieldId];
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

        case ActionName.SetField: {
            const [fieldIndex] = options.path;
            if (fieldIndex > -1) {
                fields.splice(fieldIndex, 1, {
                    ...fields[fieldIndex],
                    ...options.newField
                });
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
