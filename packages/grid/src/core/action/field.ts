import { ActionName, AddFieldAction, AIFieldPath, AITable, AITableField, RemoveFieldAction, SetFieldAction } from '../types';
import { AITableQueries } from '../utils';

export function addField(aiTable: AITable, field: AITableField, path: AIFieldPath) {
    const operation: AddFieldAction = {
        type: ActionName.AddField,
        field,
        path
    };
    aiTable.apply(operation);
}

export function removeField(aiTable: AITable, path: AIFieldPath) {
    const operation: RemoveFieldAction = {
        type: ActionName.RemoveField,
        path
    };
    aiTable.apply(operation);
}

export function setField(aiTable: AITable, value: Partial<AITableField>, path: AIFieldPath) {
    const field = AITableQueries.getField(aiTable, path);
    if (field) {
        const oldField: Partial<AITableField> = {};
        const newField: Partial<AITableField> = {};
        for (const k in value) {
            if (field[k] !== value[k]) {
                if (field.hasOwnProperty(k)) {
                    oldField[k] = field[k];
                }
                newField[k] = value[k];
            }
        }

        const operation: SetFieldAction = {
            type: ActionName.SetField,
            field: oldField,
            newField,
            path
        };

        aiTable.apply(operation);
    }
}

export const FieldActions = {
    addField,
    removeField,
    setField
};
