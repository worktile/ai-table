import { ActionName, AddFieldAction, AIFieldPath, AITable, AITableField } from '../types';
import { AITableQueries } from '../utils';

export function addField(aiTable: AITable, field: AITableField, path: AIFieldPath) {
    const operation: AddFieldAction = {
        type: ActionName.AddField,
        field,
        path
    };
    aiTable.apply(operation);
}

export function setField(aiTable: AITable, value: Partial<AITableField>, path: AIFieldPath) {
    const node = AITableQueries.getField(aiTable, path);
    if (node) {
        const field: Partial<AITableField> = {};
        const newField: Partial<AITableField> = {};
        for (const k in value) {
            if (node[k] !== value[k]) {
                if (node.hasOwnProperty(k)) {
                    field[k] = node[k];
                }
                newField[k] = value[k];
            }
        }

        const operation: SetFieldAction = {
            type: ActionName.SetField,
            field,
            newField,
            path
        };

        aiTable.apply(operation);
    }
}


export const FieldActions = {
    addField,
    setField
};
