import { AITableField, AITableRecord } from './core';

export type AIRecordPath = [number];

export type AIRecordIdPath = [string];

export type AIFieldPath = [number];

export type AIFieldIdPath = [string];

export type AIFieldValueIdPath = [string, string];

export type Path = AIRecordPath | AIFieldPath | AIFieldIdPath | AIRecordIdPath | AIFieldValueIdPath;

export enum ActionName {
    UpdateFieldValue = 'update_field_value',
    AddRecord = 'add_record',
    AddField = 'add_field',
    MoveField = 'move_field',
    MoveRecord = 'move_record',
    RemoveField = 'remove_field',
    RemoveRecord = 'remove_record',
    SetField = 'set_field'
}

export enum ExecuteType {
    Execute,
    Undo,
    Redo
}

export type UpdateFieldValueAction = {
    type: ActionName.UpdateFieldValue;
    path: AIFieldValueIdPath;
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

export type MoveFieldAction = {
    type: ActionName.MoveField;
    path: AIFieldPath;
    newPath: AIFieldPath;
};

export type MoveRecordAction = {
    type: ActionName.MoveRecord;
    path: AIRecordPath;
    newPath: AIRecordPath;
};

export type RemoveFieldAction = {
    type: ActionName.RemoveField;
    path: AIFieldIdPath;
};

export type RemoveRecordAction = {
    type: ActionName.RemoveRecord;
    path: AIRecordIdPath;
};

export type SetFieldAction = {
    type: ActionName.SetField;
    path: AIFieldIdPath;
    properties: Partial<AITableField>;
    newProperties: Partial<AITableField>;
};

export type AITableAction =
    | UpdateFieldValueAction
    | AddRecordAction
    | AddFieldAction
    | RemoveRecordAction
    | RemoveFieldAction
    | SetFieldAction
    | MoveFieldAction
    | MoveRecordAction;
