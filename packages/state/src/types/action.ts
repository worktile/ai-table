import { AIFieldValueIdPath, AITableField, AITableRecord, IdPath, NumberPath } from '@ai-table/grid';
import { AITableView, AITableViewRecord, Positions } from './view';

export enum ActionName {
    UpdateFieldValue = 'update_field_value',
    AddRecord = 'add_record',
    AddField = 'add_field',
    MoveField = 'move_field',
    MoveRecord = 'move_record',
    RemoveField = 'remove_field',
    RemoveRecord = 'remove_record',
    SetField = 'set_field',
    SetView = 'set_view',
    AddView = 'add_view',
    RemoveView = 'remove_view',
    AddRecordPosition = 'add_record_position',
    RemoveRecordPosition = 'remove_record_position'
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
    path: NumberPath;
    record: AITableRecord | AITableViewRecord;
};

export type AddFieldAction = {
    type: ActionName.AddField;
    path: NumberPath;
    field: AITableField;
};

export type MoveFieldAction = {
    type: ActionName.MoveField;
    path: NumberPath;
    newPath: NumberPath;
};

export type MoveRecordAction = {
    type: ActionName.MoveRecord;
    path: NumberPath;
    newPath: NumberPath;
};

export type RemoveFieldAction = {
    type: ActionName.RemoveField;
    path: IdPath;
};

export type RemoveRecordAction = {
    type: ActionName.RemoveRecord;
    path: IdPath;
};

export type SetFieldAction = {
    type: ActionName.SetField;
    path: IdPath;
    properties: Partial<AITableField>;
    newProperties: Partial<AITableField>;
};

export interface SetViewAction {
    type: ActionName.SetView;
    properties: Partial<AITableView>;
    newProperties: Partial<AITableView>;
    path: IdPath;
}

export interface AddViewAction {
    type: ActionName.AddView;
    view: AITableView;
    path: [number];
}

export interface RemoveViewAction {
    type: ActionName.RemoveView;
    path: IdPath;
}

export interface AddRecordPositionAction {
    type: ActionName.AddRecordPosition;
    position: Positions;
    path: IdPath;
}

export interface RemoveRecordPositionAction {
    type: ActionName.RemoveRecordPosition;
    path: [string, string];
}

export type AITableViewAction = SetViewAction | AddViewAction | RemoveViewAction;

export type AITablePositionAction = AddRecordPositionAction | RemoveRecordPositionAction;

export type AITableAction =
    | UpdateFieldValueAction
    | AddRecordAction
    | AddFieldAction
    | RemoveRecordAction
    | RemoveFieldAction
    | SetFieldAction
    | MoveFieldAction
    | MoveRecordAction
    | AITableViewAction
    | AITablePositionAction;
