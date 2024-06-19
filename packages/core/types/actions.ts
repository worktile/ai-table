import { WritableSignal } from "@angular/core";
import { ResourceType } from "./core";

export class Actions {
    public static updateFieldValue = "updateFieldValue";
    public static addRow = "addRow";
    public static addColumn = "addColumn";
}

export enum ActionName {
    UpdateFieldValue = "UpdateFieldValue",
    AddRecord = "AddRecord",
    AddColumn = "AddColumn",
}

export type ActionsType = {
    [key in keyof typeof ActionName]: (typeof ActionName)[key] extends string
        ? (typeof ActionName)[key]
        : never;
}[keyof typeof ActionName];

export interface ActionExecuteContext<TData> {
    data: WritableSignal<TData>;
}

export interface ICollaCommandExecuteResultBase {
    resourceId: string;
    resourceType: ResourceType;
}

export interface Operation {
    type: ActionName;
    actions: any;
}

export enum ExecuteType {
    Execute,
    Undo,
    Redo,
}

export interface ActionExecuteResultBase {
    resourceType: ResourceType;
}

export interface ActionExecuteResult<T = any> extends ActionExecuteResultBase {
    data: T;
    operation: Operation;
    executeType: ExecuteType;
}

export interface ActionOptionsBase extends ActionExecuteResultBase {
    type: ActionName;
}

export interface ActionDefExecuteResult<T> extends ActionExecuteResultBase {
    data: T;
    actions: any;
}

export interface ActionDef<P = any, T = any, R = {} > {
    /**
     * Declare whether the command supports undo
     */
    // readonly undoable: boolean;

    /**
     * Actions are generated if the execution is successful, and the reason is returned if it fails. No need to deal with returning null.
     */
    readonly execute: (
        context: ActionExecuteContext<P>,
        options: T
    ) => ActionDefExecuteResult<R> | null;
    /**
     * Determine whether the current undo can be undone, if not, it can be undo by default
     */
    // readonly canUndo?: (
    //     context: ActionExecuteContext,
    //     actions: any[]
    // ) => boolean;

    // /**
    //  * Determine whether redo is currently possible, if not, redo can be done by default
    //  */
    // readonly canRedo?: (
    //     context: ActionExecuteContext,
    //     actions: any[]
    // ) => boolean;
}
