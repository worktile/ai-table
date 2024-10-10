import { AITableField, AITableQueries, IdPath, NumberPath } from '@ai-table/grid';
import {
    ActionName,
    AddFieldAction,
    MoveFieldAction,
    RemoveFieldAction,
    SetFieldAction,
    AIViewTable
} from '../types';
import { AITableViewField } from '../types/view';

export function addField(AIViewTable: AIViewTable, field: AITableField, path: NumberPath) {
    const operation: AddFieldAction = {
        type: ActionName.AddField,
        field,
        path
    };
    AIViewTable.apply(operation);
}

export function moveField(AIViewTable: AIViewTable, path: NumberPath, newPath: NumberPath) {
    const operation: MoveFieldAction = {
        type: ActionName.MoveField,
        path,
        newPath
    };
    AIViewTable.apply(operation);
}

export function removeField(AIViewTable: AIViewTable, path: IdPath) {
    const operation: RemoveFieldAction = {
        type: ActionName.RemoveField,
        path
    };
    AIViewTable.apply(operation);
}

export function setField<T extends AITableViewField = AITableViewField>(AIViewTable: AIViewTable, value: Partial<T>, path: IdPath) {
    const field = AITableQueries.getField(AIViewTable, path) as T;
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

        AIViewTable.apply(operation);
    }
}

export const FieldActions = {
    addField,
    moveField,
    removeField,
    setField
};
