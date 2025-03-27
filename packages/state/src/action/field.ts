import { AITableField, AITableQueries, IdPath, NumberPath } from '@ai-table/grid';
import { ActionName, AddFieldAction, RemoveFieldAction, SetFieldAction, AIViewTable } from '../types';
import { AITableViewField } from '../types/view';
import { isPathEqual, updateFieldPositionInView } from '../utils';
import { cloneDeep } from 'lodash';

export function addField(aiTable: AIViewTable, field: AITableField, path: NumberPath, originId?: string, isCopy?: boolean) {
    const operation: AddFieldAction = {
        type: ActionName.AddField,
        field,
        path,
        originId,
        isCopy
    };
    aiTable.apply(operation);
}

export function moveField(aiTable: AIViewTable, path: NumberPath, newPath: NumberPath) {
    if (isPathEqual(path, newPath)) {
        return;
    }
    const fields = aiTable.fields();
    const activeView = aiTable.views().find((item) => item._id === aiTable.activeViewId());
    const sourceField = cloneDeep(fields[path[0]]);
    const targetField = fields[newPath[0]];
    updateFieldPositionInView(activeView!._id, fields, sourceField, targetField, path, newPath);
    setField(aiTable, sourceField, [sourceField._id]);
}

export function removeField(aiTable: AIViewTable, path: IdPath) {
    const operation: RemoveFieldAction = {
        type: ActionName.RemoveField,
        path
    };
    aiTable.apply(operation);
}

export function setField<T extends AITableViewField = AITableViewField>(aiTable: AIViewTable, value: Partial<T>, path: IdPath) {
    const field = AITableQueries.getField(aiTable, path) as T;
    if (field) {
        const properties: Partial<T> = {};
        const newProperties: Partial<T> = {};
        for (const key in value) {
            const k = key as keyof T;
            if (JSON.stringify(field[k]) !== JSON.stringify(value[k])) {
                if (field.hasOwnProperty(k)) {
                    properties[k] = field[k] as any;
                }
                if (newProperties[k] !== null) {
                    newProperties[k] = value[k] as any;
                }
            }
        }

        const operation: SetFieldAction = {
            type: ActionName.SetField,
            properties,
            newProperties,
            path
        };

        aiTable.apply(operation);
    }
}

export const FieldActions = {
    addField,
    moveField,
    removeField,
    setField
};
