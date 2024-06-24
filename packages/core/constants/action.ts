import { WritableSignal } from "@angular/core";
import { ActionOptions, updateFieldValue } from "../action";
import { ActionDef, ActionName, VTableValue } from "../types";
import { addRecord } from "../action/add-record";

export const ACTION_MAP: Record<ActionName, ActionDef<any>> = {
    [ActionName.UpdateFieldValue]: updateFieldValue,
    [ActionName.AddRecord]: addRecord,
};
