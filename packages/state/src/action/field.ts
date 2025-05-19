import { AITableQueries } from '@ai-table/grid';
import {
    ActionName,
    AddFieldAction,
    RemoveFieldAction,
    SetFieldAction,
    AITableViewField,
    AITableField,
    IdPath,
    NumberPath
} from '@ai-table/utils';
import { isPathEqual } from '../utils';
import { getFieldPositionInView } from '../utils/field/position-field';
import { AIViewTable } from '../types/ai-table';

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

export function moveField(aiTable: AIViewTable, path: NumberPath, newPath: NumberPath) {
    if (isPathEqual(path, newPath)) {
        return;
    }
    const fields = aiTable.gridData().fields;
    const activeView = aiTable.views().find((item) => item._id === aiTable.activeViewId());
    const sourceField = fields[path[0]] as AITableViewField;
    const position = getFieldPositionInView(activeView!._id, fields, path, newPath);
    setField(aiTable, { positions: { ...sourceField.positions, [activeView!._id]: position } }, [sourceField._id]);
}

export function setFieldWidth(aiTable: AIViewTable, path: IdPath, width: number) {
    const field = AITableQueries.getField(aiTable, path) as AITableViewField;
    const activeView = aiTable.views().find((item) => item._id === aiTable.activeViewId());
    setField(aiTable, { widths: { ...field.widths, [activeView!._id]: width } }, [field._id]);
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
    moveField,
    removeField,
    setField,
    setFieldWidth
};
