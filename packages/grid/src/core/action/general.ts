import { ActionName, AITable, AITableAction, AITableField, AITableFields, AITableRecords } from '../types';
import { createDraft, finishDraft } from 'immer';
import { getDefaultFieldValue, isPathEqual } from '../utils';

const apply = (aiTable: AITable, records: AITableRecords, fields: AITableFields, action: AITableAction) => {
    switch (action.type) {
        case ActionName.UpdateFieldValue: {
            const [recordId, fieldId] = action.path;
            if (recordId && fieldId) {
                const recordIndex = aiTable.records().findIndex((item) => item._id === recordId);
                records[recordIndex].values[fieldId] = action.newFieldValue;
            }
            break;
        }
        case ActionName.AddRecord: {
            const [recordIndex] = action.path;
            if (recordIndex > -1) {
                records.splice(recordIndex, 0, action.record);
            }
            break;
        }
        case ActionName.AddField: {
            const [fieldIndex] = action.path;
            if (fieldIndex > -1) {
                const newField = action.field;
                fields.splice(fieldIndex, 0, newField);
                const newRecord = {
                    [newField._id]: getDefaultFieldValue(action.field)
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
            if (isPathEqual(action.path, action.newPath)) {
                return;
            }
            const record = records[action.path[0]];
            records.splice(action.path[0], 1);
            records.splice(action.newPath[0], 0, record);
            break;
        }
        case ActionName.MoveField: {
            if (isPathEqual(action.path, action.newPath)) {
                return;
            }
            const field = fields[action.path[0]];
            fields.splice(action.path[0], 1);
            fields.splice(action.newPath[0], 0, field);

            break;
        }
        case ActionName.RemoveField: {
            const [fieldId] = action.path;
            const fieldIndex = aiTable.fields().findIndex((item) => item._id === fieldId);
            if (fieldIndex > -1) {
                fields.splice(fieldIndex, 1);
                records.forEach((item) => {
                    delete item.values[fieldId];
                });
            }
            break;
        }
        case ActionName.RemoveRecord: {
            const [recordId] = action.path;
            const recordIndex = aiTable.records().findIndex((item) => item._id === recordId);
            if (recordIndex > -1) {
                records.splice(recordIndex, 1);
            }
            break;
        }

        case ActionName.SetField: {
            const field = fields.find((item) => item._id === action.path[0]) as AITableField;
            if (field) {
                for (const key in action.newProperties) {
                    const k = key as keyof AITableField;
                    const value = action.newProperties[k];
                    if (value == null) {
                        delete field[k];
                    } else {
                        (field[k] as any) = value;
                    }
                }

                // properties that were previously defined, but are now missing, must be deleted
                for (const key in action.properties) {
                    if (!action.newProperties.hasOwnProperty(key)) {
                        delete field[<keyof AITableField>key];
                    }
                }
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
    transform(aiTable: AITable, action: AITableAction): void {
        const records = createDraft(aiTable.records());
        const fields = createDraft(aiTable.fields());
        apply(aiTable, records, fields, action);
        aiTable.fields.update(() => {
            return finishDraft(fields);
        });
        console.time('immer update time');
        aiTable.records.update(() => {
            return finishDraft(records);
        });
        console.timeEnd('immer update time');
        console.log(new Date().getTime(), `ai-table update field value`);
    }
};
