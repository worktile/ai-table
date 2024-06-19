import { WritableSignal } from "@angular/core";
import { ActionDefExecuteResult, ActionName } from "../../types/actions";
import { SharedType } from "../convert";
import setField from "./set-field";
import insertNode from "./insert-node";

export type ApplyFunc = (
    sharedType: SharedType,
    value: WritableSignal<any>,
    ret: ActionDefExecuteResult<any>
) => void;

export type OpMapper = {
    [O in ActionName]: ApplyFunc;
};

export const ApplyToYjsMapper = {
    [ActionName.UpdateFieldValue]: setField,
    [ActionName.AddRecord]: insertNode,
    [ActionName.AddColumn]: insertNode,
};
