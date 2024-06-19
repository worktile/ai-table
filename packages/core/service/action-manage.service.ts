import {
    effect,
    Injectable,
    Signal,
    signal,
    WritableSignal,
} from "@angular/core";
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
import { getSharedType, YjsVTable } from "../utils/yjs";
import { SharedType, SyncElement, SyncNode } from "../utils/convert";
import * as Y from "yjs";
import setField from "../utils/apply-to-yjs/set-field";
import { ApplyToYjsMapper } from "../utils/apply-to-yjs";

@Injectable({
    providedIn: "root",
})
export class ActionManager<TData> {
    value!: WritableSignal<TData>;

    sharedType!: SharedType;

    change$ = new Subject<TData>();

    undoManager!: Y.UndoManager;

    private readonly _actions: { [name: string]: Action } = {};

    constructor() {
        const commandNames = Object.keys(ACTION_MAP);
        commandNames.forEach((commandName) => {
            this.register(commandName, ACTION_MAP[commandName]!);
        });
    }

    init(value: WritableSignal<TData>) {
        this.value = value;
    }

    initSharedType(sharedType: SharedType) {
        this.sharedType = sharedType;
        this.undoManager = new Y.UndoManager(this.sharedType, {
            captureTimeout: 300,
            deleteFilter: () => true,
        });

        this.undoManager.on("stack-item-added", (event) => {
            console.log("add", event);
        });

        this.undoManager.on("stack-item-popped", (event) => {
            console.log("pop", event);
        });
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
        ret = action.execute({ data: this.value }, options);
        if (!ret) {
            return null;
        }
        if (!YjsVTable.isRemote(this.value) && !YjsVTable.isUndo(this.value)) {
            YjsVTable.asLocal(this.value, () => {
                this.sharedType.doc!.transact(() => {
                    ApplyToYjsMapper[ret.actions.type as ActionName](
                        this.sharedType,
                        this.value,
                        ret
                    );
                });
            });
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
