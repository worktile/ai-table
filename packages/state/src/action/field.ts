import { AITableQueries } from '@ai-table/grid';
import {
    ActionName,
    AddFieldAction,
    RemoveFieldAction,
    SetFieldAction,
    AITableViewField,
    AITableField,
    IdPath,
    NumberPath,
    AITableFieldStatType
} from '@ai-table/utils';
import { isPathEqual } from '../utils';
import { getFieldPositionInView } from '../utils/field/position-field';
import { getFrozenFieldId } from '../utils/field/frozen-field';
import { setViewFrozenField } from './view';
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

    const currentFrozenFieldId = getFrozenFieldId(aiTable);

    adjustFrozenFieldAfterMove(aiTable, path[0], newPath[0], currentFrozenFieldId);

    const position = getFieldPositionInView(activeView!._id, fields, path, newPath);
    setField(aiTable, { positions: { ...sourceField.positions, [activeView!._id]: position } }, [sourceField._id]);
}

function adjustFrozenFieldAfterMove(aiTable: AIViewTable, sourceIndex: number, targetIndex: number, currentFrozenFieldId?: string) {
    if (!currentFrozenFieldId) {
        return;
    }

    const fields = aiTable.gridData().fields;
    const currentFrozenFieldIndex = fields.findIndex((field) => field._id === currentFrozenFieldId);

    if (currentFrozenFieldIndex === -1) {
        return;
    }

    // 最后冻结列拖动到非冻结区或冻结区，冻结列向左移动
    if (sourceIndex === currentFrozenFieldIndex && targetIndex !== currentFrozenFieldIndex) {
        const newFrozenFieldIndex = Math.max(0, currentFrozenFieldIndex - 1);
        if (newFrozenFieldIndex < fields.length && newFrozenFieldIndex !== currentFrozenFieldIndex) {
            const newFrozenField = fields[newFrozenFieldIndex];
            setViewFrozenField(aiTable, newFrozenField._id);
        } else {
            // 如果没有前一个字段，恢复默认冻结
            setViewFrozenField(aiTable, undefined);
        }
        return;
    }

    // 冻结区拖动到最后冻结列后面，冻结列是被拖动列
    if (sourceIndex < currentFrozenFieldIndex && targetIndex === currentFrozenFieldIndex) {
        const newFrozenField = fields[sourceIndex];
        setViewFrozenField(aiTable, newFrozenField._id);
        return;
    }
}

export function setFieldWidth(aiTable: AIViewTable, path: IdPath, width: number) {
    const field = AITableQueries.getField(aiTable, path) as AITableViewField;
    setField(aiTable, { widths: { ...field.widths, [aiTable.activeViewId()]: width } }, [field._id]);
}

export function setFieldStatType(aiTable: AIViewTable, path: IdPath, statType: AITableFieldStatType) {
    const field = AITableQueries.getField(aiTable, path) as AITableViewField;
    setField(aiTable, { fieldStatTypes: { ...field.fieldStatTypes, [aiTable.activeViewId()]: statType } }, [field._id]);
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
    setFieldWidth,
    setFieldStatType
};
