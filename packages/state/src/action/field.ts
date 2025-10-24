import { AITableQueries } from '@ai-table/grid';
import {
    ActionName,
    AddFieldAction,
    RemoveFieldAction,
    SetFieldAction,
    AITableViewField,
    AITableField,
    IdPath,
    AITableFieldStatType
} from '@ai-table/utils';
import { AIViewTable } from '../types/ai-table';

// addField、removeField、setField(含widths，fieldStatTypes)

export function addField(aiTable: AIViewTable, field: AITableField, originId?: string, isDuplicate?: boolean) {
    const operation: AddFieldAction = {
        type: ActionName.AddField,
        field,
        originId,
        isDuplicate
    };
    const existField = aiTable.fields().some((item) => {
        return item._id === field._id;
    });
    if (existField) {
        console.error(`Field with id ${field._id} already exists.`, field);
        throw new Error(`Field with id ${field._id} already exists.`);
    }
    aiTable.apply(operation);
}

export function setFieldWidth(aiTable: AIViewTable, path: IdPath, width: number) {
    const field = AITableQueries.getField(aiTable, path) as AITableViewField;
    setField(aiTable, { widths: { ...field.widths, [aiTable.activeViewId()]: width } }, [field._id]);
}

export function setFieldStatType(aiTable: AIViewTable, path: IdPath, statType: AITableFieldStatType) {
    const field = AITableQueries.getField(aiTable, path) as AITableViewField;
    setField(aiTable, { stat_types: { ...field.stat_types, [aiTable.activeViewId()]: statType } }, [field._id]);
}

export function removeField(aiTable: AIViewTable, path: IdPath) {
    const operation: RemoveFieldAction = {
        type: ActionName.RemoveField,
        path
    };
    aiTable.apply(operation);
}

export function buildSetFieldAction<T extends AITableViewField = AITableViewField>(
    aiTable: AIViewTable,
    value: Partial<T>,
    path: IdPath
): SetFieldAction | null {
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
        return operation;
    }
    return null;
}

export function setField<T extends AITableViewField = AITableViewField>(aiTable: AIViewTable, value: Partial<T>, path: IdPath) {
    const action = buildSetFieldAction(aiTable, value, path);
    if (action) {
        aiTable.apply(action);
    }
}

export const FieldActions = {
    addField,
    removeField,
    setField,
    setFieldWidth,
    setFieldStatType
};
