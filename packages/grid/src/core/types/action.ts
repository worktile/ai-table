import { AITableField, AITableRecord } from './core';

export type AIRecordPath = [number];

export type AIFieldPath = [number];

export type AIFieldValuePath = [number, number];

export type Path = AIRecordPath | AIFieldPath | AIFieldValuePath;

export enum ActionName {
    UpdateFieldValue = 'update_field_value',
    AddRecord = 'add_record',
    AddField = 'add_field',
    RemoveField = 'remove_field',
    RemoveRecord = 'remove_record'
}

export enum ExecuteType {
    Execute,
    Undo,
    Redo
}

export type UpdateFieldValueAction = {
    type: ActionName.UpdateFieldValue;
    path: AIFieldValuePath;
    fieldValue: any;
    newFieldValue: any;
};

export type AddRecordAction = {
    type: ActionName.AddRecord;
    path: AIRecordPath;
    record: AITableRecord;
};

export type AddFieldAction = {
    type: ActionName.AddField;
    path: AIFieldPath;
    field: AITableField;
};

export type RemoveFieldAction = {
    type: ActionName.RemoveField;
    path: AIFieldPath;
};

export type RemoveRecordAction = {
    type: ActionName.RemoveRecord;
    path: AIRecordPath;
};

export type AITableAction = UpdateFieldValueAction | AddRecordAction | AddFieldAction | RemoveRecordAction | RemoveFieldAction;
