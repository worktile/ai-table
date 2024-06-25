import { WritableSignal } from "@angular/core";
import { VTableValue, VTableViewType } from "./core";
import { ActionOptions } from "../action";

export type RecordPath = number;

export type FieldPath = number;

export interface ActionExecuteResultBase {
    viewType: VTableViewType;
}

export enum ActionName {
    UpdateFieldValue,
    AddRecord,
}

export interface ActionOptionsBase<T = any> extends ActionExecuteResultBase {
    type: ActionName;
    path: [RecordPath] | [FieldPath] | [RecordPath, FieldPath];
    data: T;
}

export interface ActionDefExecuteResult {
    action: ActionOptionsBase;
}

export interface ActionDef<T extends ActionOptionsBase = ActionOptions> {
    readonly execute: (
        context: WritableSignal<VTableValue>,
        options: T,
    ) => ActionDefExecuteResult | null;
}

export enum ExecuteType {
    Execute,
    Undo,
    Redo,
}

export interface ActionExecuteResult extends ActionDefExecuteResult {
    executeType: ExecuteType;
}
