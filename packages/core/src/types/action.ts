import { VTableRecord, VTableViewType } from "./core";

export type RecordPath = number;

export type FieldPath = number;

export type Path = [RecordPath] | [FieldPath] | [RecordPath, FieldPath];

export interface ActionExecuteResultBase {
    viewType: VTableViewType;
}

export enum ActionName {
    UpdateFieldValue,
    AddRecord,
}

export enum ExecuteType {
    Execute,
    Undo,
    Redo,
}

export type UpdateFieldValueAction = {
    type: ActionName.UpdateFieldValue;
    path: [RecordPath, FieldPath];
    properties: {
        value: any;
    };
    newProperties: {
        value: any;
    };
};

export type AddRecordAction = {
    type: ActionName.AddRecord;
    path: [RecordPath];
    record: VTableRecord;
};

export type VTableAction = UpdateFieldValueAction | AddRecordAction;
