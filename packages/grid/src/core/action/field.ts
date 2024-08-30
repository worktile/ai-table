import {
    ActionName,
    AddFieldAction,
    AIFieldIdPath,
    AIFieldPath,
    AITable,
    AITableField,
    MoveFieldAction,
    RemoveFieldAction,
    SetFieldAction
} from '../types';
import { AITableQueries } from '../utils';

export function addField(aiTable: AITable, field: AITableField, path: AIFieldPath) {
    const operation: AddFieldAction = {
        type: ActionName.AddField,
        field,
        path
    };
    aiTable.apply(operation);
}

export function moveField(aiTable: AITable, path: AIFieldPath, newPath: AIFieldPath) {
    const operation: MoveFieldAction = {
        type: ActionName.MoveField,
        path,
        newPath
    };
    aiTable.apply(operation);
}

export function removeField(aiTable: AITable, path: AIFieldIdPath) {
    const operation: RemoveFieldAction = {
        type: ActionName.RemoveField,
        path
    };
    aiTable.apply(operation);
}

export function setField(aiTable: AITable, value: Partial<AITableField>, path: AIFieldIdPath) {
    const field = AITableQueries.getField(aiTable, path);
    if (field) {
        const properties: Partial<AITableField> = {};
        const newProperties: Partial<AITableField> = {};
        for (const key in value) {
            const k = key as keyof AITableField;
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
