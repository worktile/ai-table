import { AIViewTable } from '../types';
import { createDraft, finishDraft } from 'immer';
import { FieldModelMap } from '@ai-table/grid';
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
                const recordIndex = records.findIndex((item) => item._id === recordId);
                records[recordIndex].values[fieldId] = action.newFieldValue;
            }
            break;
        }
        case ActionName.UpdateSystemFieldValue: {
            const [recordId] = action.path;
            if (recordId && action.updatedInfo) {
                const recordIndex = records.findIndex((item) => item._id === recordId);
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
            records.push(action.record as AITableViewRecord);
            break;
        }
        case ActionName.AddField: {
            const newField = action.field;
            fields.push(newField as AITableViewField);
            const defaultValue = FieldModelMap[newField.type].getDefaultValue();
            records.forEach((item) => {
                item.values[newField._id] = action.isDuplicate && action.originId ? item.values[action.originId] : defaultValue;
            });
            break;
        }
        case ActionName.RemoveField: {
            const [fieldId] = action.path;
            const fieldIndex = fields.findIndex((item) => item._id === fieldId);
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
            const recordIndex = records.findIndex((item) => item._id === recordId);
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
                        console.log('setView action.properties 会执行吗？', key);
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
            const record = records[path[0]];
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

    // 不需要？
    // return {
    //     records,
    //     fields,
    //     views
    // };
};

export const GeneralActions = {
    transform(aiTable: AIViewTable, actions: AITableAction[]): void {
        // 先操作 draft，而不是直接改 aiTable
        const records = createDraft(aiTable.records()) as AITableViewRecords;
        const fields = createDraft(aiTable.fields()) as AITableViewFields;
        const views = createDraft(aiTable.views?.() || []);
        actions.forEach((action) => {
            // 执行 action
            apply(aiTable, records, fields, views, action);
        });
        const newFields = finishDraft(fields);
        const newRecords = finishDraft(records);
        const newViews = finishDraft(views);

        // 变更检测，唯一修改 aiTable 的 views、fields、records
        if (newFields !== aiTable.fields()) {
            console.log('⭐️ aiTable.fields changed');
            aiTable.fields.set(newFields);
        }
        if (newRecords !== aiTable.records()) {
            console.log('⭐️ aiTable.records changed');
            aiTable.records.set(newRecords);
        }
        if (newViews !== (aiTable.views?.() || [])) {
            console.log('⭐️ aiTable.views changed');
            aiTable.views?.set(newViews);
        }
    }
};
