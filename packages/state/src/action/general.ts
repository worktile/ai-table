import { AIViewTable } from '../types';
import { ActionName, AITableAction } from '@ai-table/utils';
import { createDraft, finishDraft } from 'immer';
import { getDefaultFieldValue } from '@ai-table/grid';
import { createDefaultPositions, sortViews } from '../utils';
import {
    AITableField,
    AITableFields,
    AITableView,
    AITableViewField,
    AITableViewFields,
    AITableViewRecord,
    AITableViewRecords
} from '@ai-table/utils';

const apply = (aiTable: AIViewTable, records: AITableViewRecords, fields: AITableFields, views: AITableView[], action: AITableAction) => {
    switch (action.type) {
        case ActionName.UpdateFieldValue: {
            const [recordId, fieldId] = action.path;
            if (recordId && fieldId) {
                const recordIndex = aiTable.records().findIndex((item) => item._id === recordId);
                records[recordIndex].values[fieldId] = action.newFieldValue;
            }
            break;
        }
        case ActionName.UpdateSystemFieldValue: {
            const [recordId] = action.path;
            if (recordId && action.updatedInfo) {
                const recordIndex = aiTable.records().findIndex((item) => item._id === recordId);
                if (action.updatedInfo.updated_at) {
                    records[recordIndex].updated_at = action.updatedInfo.updated_at;
                }
                if (action.updatedInfo.updated_by) {
                    records[recordIndex].updated_by = action.updatedInfo.updated_by;
                }
            }
            break;
        }
        case ActionName.AddRecord: {
            if (!(action.record as AITableViewRecord).positions) {
                (action.record as AITableViewRecord).positions = createDefaultPositions(
                    aiTable.views(),
                    aiTable.activeViewId(),
                    aiTable.records() as AITableViewRecords,
                    records.length
                );
            }
            records.push(action.record as AITableViewRecord);
            break;
        }
        case ActionName.AddField: {
            const newField = action.field;
            fields.push(newField as AITableViewField);
            records.forEach((item) => {
                item.values[newField._id] =
                    action.isCopy && action.originId ? item.values[action.originId] : getDefaultFieldValue(action.field);
            });
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
        case ActionName.SetView: {
            const view = views.find((item) => item._id === action.path[0]) as AITableView;
            if (view) {
                for (const key in action.newProperties) {
                    const k = key as keyof AITableView;
                    const value = action.newProperties[k];
                    if (value == null) {
                        delete view[k];
                    } else {
                        (view[k] as any) = value;
                    }
                }

                // properties that were previously defined, but are now missing, must be deleted
                for (const key in action.properties) {
                    if (!action.newProperties.hasOwnProperty(key)) {
                        delete view[<keyof AITableView>key];
                    }
                }
            }
            break;
        }
        case ActionName.AddView: {
            views.push(action.view);
            break;
        }
        case ActionName.RemoveView: {
            const [viewId] = action.path;
            const viewIndex = views.findIndex((item) => item._id === viewId);
            if (viewIndex > -1) {
                views.splice(viewIndex, 1);
            }
            break;
        }
        case ActionName.SetRecordPositions: {
            const { positions, path } = action;
            const record = records.find((item) => item._id === path[0]);
            if (record) {
                const newPositions = { ...record.positions };
                for (const key in positions) {
                    if (positions[key] === null || positions[key] === undefined) {
                        delete newPositions[key];
                    } else {
                        newPositions[key] = positions[key] as number;
                    }
                }
                record.positions = newPositions;
            }
            break;
        }
    }
    return {
        records,
        fields,
        views
    };
};

export const GeneralActions = {
    transform(aiTable: AIViewTable, action: AITableAction): void {
        const records = createDraft(aiTable.records()) as AITableViewRecords;
        const fields = createDraft(aiTable.fields()) as AITableViewFields;
        const views = createDraft(aiTable.views());
        apply(aiTable, records, fields, views, action);
        const newFields = finishDraft(fields);
        const newRecords = finishDraft(records);
        const newViews = finishDraft(views);
        if (newFields !== aiTable.fields()) {
            aiTable.fields.set(newFields);
        }
        if (newRecords !== aiTable.records()) {
            aiTable.records.set(newRecords);
        }
        if (newViews !== aiTable.views()) {
            aiTable.views.set(sortViews(newViews));
        }
    }
};
