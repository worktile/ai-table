import { VTableField, VTableRecord, VTableViewType } from './core';

export type RecordPath = number;

export type FieldPath = number;

export type Path = [RecordPath] | [FieldPath] | [RecordPath, FieldPath];

export interface ActionExecuteResultBase {
    viewType: VTableViewType;
}

export enum ActionName {
    UpdateFieldValue = 'update_field_value',
    AddRecord = 'add_record',
    AddField = 'add_field'
}

export enum ExecuteType {
    Execute,
    Undo,
    Redo
}

export type UpdateFieldValueAction = {
    type: ActionName.UpdateFieldValue;
    path: [RecordPath, FieldPath];
    fieldValue: any;
    newFieldValue: any;
};

export type AddRecordAction = {
    type: ActionName.AddRecord;
    path: [RecordPath];
    record: VTableRecord;
};

export type AddFieldAction = {
    type: ActionName.AddField;
    path: [FieldPath];
    field: VTableField;
};

export type VTableAction = UpdateFieldValueAction | AddRecordAction | AddFieldAction;
