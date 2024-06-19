import { WritableSignal } from "@angular/core";
import { ActionDefExecuteResult } from "../../types/actions";
import { SharedType, SyncElement, toSyncElement } from "../convert";
import * as Y from "yjs";

export default function insertNode(
    sharedType: SharedType,
    value: WritableSignal<any>,
    ret: ActionDefExecuteResult<any>
) {
    let children: Y.Array<SyncElement>;
    if (sharedType instanceof Y.Array) {
        children = sharedType;
    } else {
        children = (sharedType as SyncElement).get("children");
    }
    children.insert(ret.actions.data.index, [
        toSyncElement({ type: ret.actions.type, ...ret.actions.data.value }),
    ]);
}
