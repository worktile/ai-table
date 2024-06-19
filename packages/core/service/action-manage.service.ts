import { Injectable, signal, WritableSignal } from "@angular/core";
import { ActionOptions } from "../action";
import { ACTION_MAP } from "../constants/action";
import {
    ActionDef,
    ActionDefExecuteResult,
    ActionExecuteContext,
    ActionExecuteResult,
    ActionName,
    ExecuteType,
    Operation,
} from "../types/actions";
import { ResourceType } from "../types/core";
import { Subject } from "rxjs";
import { getSharedType } from "../utils/yjs";
import { SharedType, SyncElement, SyncNode } from "../utils/convert";
import * as Y from "yjs";

@Injectable({
    providedIn: "root",
})
export class ActionManager<TData> {
    value!: WritableSignal<TData>;

    sharedType!: SharedType;

    change$ = new Subject<TData>();

    isInitializeSharedType = false;

    private readonly _actions: { [name: string]: Action } = {};

    constructor() {
        const commandNames = Object.keys(ACTION_MAP);
        commandNames.forEach((commandName) => {
            this.register(commandName, ACTION_MAP[commandName]!);
        });
    }

    init(value: any, sharedType: SharedType) {
        this.value = signal(value);
        this.sharedType = sharedType;
    }

    register(name: string, commandDef: ActionDef) {
        if (this._actions[name]) {
            console.warn(
                `the command name ${name} is registered and will be unregistered`,
                this._actions[name]
            );
            this.unregister(name);
        }
        this._actions[name] = new Action(commandDef, name);
    }

    unregister(name: string) {
        if (this._actions[name]) {
            delete this._actions[name];
        }
    }

    execute<R extends TData>(
        options: ActionOptions
    ): ActionExecuteResult<R> | null {
        const ret = this._execute<R>(options, ResourceType.grid);
        if (ret) {
            // add undoStack
            this.change$.next(ret.data);
        }
        return ret;
    }

    private _execute<R>(
        options: ActionOptions,
        resourceType: ResourceType
    ): ActionExecuteResult<R> | null {
        const type = options.type;
        const action = this._actions[type];
        if (!action) {
            return null;
        }
        let ret: ActionDefExecuteResult<R> | null = null;
        ret = action.execute({ data: this.value() }, options);
        if (!ret) {
            return null;
        }
        //  将操作记录到 undoStack 中
        //  发送操作给协同方/ 服务端
        // this.sharedType.doc!.transact(() => {
        //     const node: SyncNode = this.sharedType;
        //     let children: Y.Array<SyncElement>;
        //     if (node instanceof Y.Array) {
        //         children = node;
        //     } else {
        //         children = (node as SyncElement).get("children");
        //     }
        //     // 根据 ret.
        //     const index = (this.value() as any).rows.findIndex(
        //         (item: { id: any }) => item.id === ret.actions.recordId
        //     );
        //     const data = children.get(index);
        //     data.set(ret.actions.fieldId, ret.actions.data);
        // });
        if (!this.isInitializeSharedType) {
            this.isInitializeSharedType = true;
        }
        return this._executeActions(
            type,
            ret,
            ExecuteType.Execute,
            resourceType
        );
    }

    _executeActions<R = any>(
        type: ActionName,
        ret: ActionDefExecuteResult<R>,
        executeType: ExecuteType,
        resourceType: ResourceType
    ): ActionExecuteResult<R> | null {
        const { actions } = ret;
        const operation: Operation = {
            type: type,
            actions: actions,
        };
        return {
            resourceType,
            data: ret.data,
            operation,
            executeType,
        };
    }
}

export interface ActionOptionBase {
    cmd: ActionName;
    resourceId: string;
    resourceType: any;
}

export class Action<P = any, T extends ActionOptionBase = any, R = any> {
    constructor(private _actionDef: ActionDef<P, T, R>, public name: string) {}

    /**
     * @returns {boolean} returns true, indicating that the result of execution can be placed in
     */
    execute(context: ActionExecuteContext<P>, options: T): any {
        return this._actionDef.execute(context, options);
    }
}
