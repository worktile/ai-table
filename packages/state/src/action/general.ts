import { AIViewTable } from '../types';
import { createDraft, finishDraft } from 'immer';
import { getDefaultFieldValue } from '@ai-table/grid';
import { createDefaultPositions } from '../utils';
import {
    ActionName,
    AITableAction,
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
                const record = aiTable.recordsMap()[recordId];
                if (record) {
                    record.values[fieldId] = action.newFieldValue;
                }
            }
            break;
        }
        case ActionName.UpdateSystemFieldValue: {
            const [recordId] = action.path;
            if (recordId && action.updatedInfo) {
                const record = aiTable.recordsMap()[recordId];
                if (record) {
                    if (action.updatedInfo.updated_at) {
                        record.updated_at = action.updatedInfo.updated_at;
                    }
                    if (action.updatedInfo.updated_by) {
                        record.updated_by = action.updatedInfo.updated_by;
                    }
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

            if (action.isDuplicate && action.originId) {
                const originId = action.originId as string;
                records.forEach((item) => {
                    item.values[newField._id] = item.values[originId];
                });
            } else {
                const defaultValue = getDefaultFieldValue(action.field);
                records.forEach((item) => {
                    item.values[newField._id] = defaultValue;
                });
            }
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
            const fieldId = action.path[0];
            const field = aiTable.fieldsMap()[fieldId];
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
            const viewId = action.path[0];
            const view = aiTable.viewsMap()[viewId];
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
            const recordId = path[0];
            const record = aiTable.recordsMap()[recordId];
            if (record) {
                const newPositions = { ...record['positions'] };
                for (const key in positions) {
                    if (positions[key] === null || positions[key] === undefined) {
                        delete newPositions[key];
                    } else {
                        newPositions[key] = positions[key] as number;
                    }
                }
                record['positions'] = newPositions;
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
            aiTable.views.set(newViews);
        }
    }
};
