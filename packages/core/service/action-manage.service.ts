import { effect, Injectable, signal, WritableSignal } from "@angular/core";
import { ActionOptions } from "../action";
import { ACTION_MAP } from "../constants/action";
import {
    ActionDef,
    ActionDefExecuteResult,
    ActionExecuteResult,
    ActionName,
    ExecuteType,
} from "../types/action";
import { VTableValue } from "../types";

@Injectable({
    providedIn: "root",
})
export class ActionManager<TValue extends VTableValue = VTableValue> {
    private _value!: WritableSignal<TValue>;

    private _actionExecuteResult!: ActionExecuteResult | null;

    get value() {
        return this._value;
    }

    get actionExecuteResult() {
        return this._actionExecuteResult;
    }

    private readonly _actions: Partial<
        Record<ActionName, Action<ActionOptions>>
    > = {};

    constructor() {
        const actionNames = Object.keys(ACTION_MAP) as unknown as ActionName[];
        actionNames.forEach((actionName) => {
            this.register(actionName, ACTION_MAP[actionName]!);
        });
    }

    init(value: WritableSignal<TValue>) {
        this._value = value;
    }

    register(name: ActionName, actionDef: ActionDef<ActionOptions>) {
        if (this._actions[name]) {
            console.warn(
                `the action name ${name} is registered and will be unregistered`,
                this._actions[name],
            );
            this.unregister(name);
        }
        this._actions[name] = new Action(actionDef);
    }

    unregister(name: ActionName) {
        if (this._actions[name]) {
            delete this._actions[name];
        }
    }

    execute<T extends ActionOptions>(options: T): ActionExecuteResult | null {
        this._actionExecuteResult = this._execute(options);
        return this._actionExecuteResult;
    }

    private _execute(options: ActionOptions): ActionExecuteResult | null {
        const type = options.type;
        const action = this._actions[type];
        if (!action) {
            return null;
        }
        let ret: ActionDefExecuteResult | null = null;
        ret = action.execute(this.value, options);
        if (!ret) {
            return null;
        }
        return {
            ...ret,
            executeType: ExecuteType.Execute,
        };
    }

    destroy() {}
}

export class Action<T extends ActionOptions = ActionOptions> {
    constructor(private _actionDef: ActionDef<T>) {}

    execute(context: WritableSignal<VTableValue>, options: T): any {
        return this._actionDef.execute(context, options);
    }
}
