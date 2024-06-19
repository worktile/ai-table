import { WritableSignal } from "@angular/core";
import { ActionDefExecuteResult } from "../../types/actions";
import { SharedType, SyncElement } from "../convert";
import * as Y from "yjs";

export default function setField(
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
    // 修改单元格数据
    const index = (value() as any).rows.findIndex(
        (item: { id: any }) => item.id === ret.actions.recordId
    );
    const element = children.get(index);
    element.set(ret.actions.fieldId, ret.actions);
}
