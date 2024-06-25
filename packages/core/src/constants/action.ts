import { ActionDef, ActionName } from "../types";
import { updateFieldValue, addRecord } from "../action";

export const ACTION_MAP: Record<ActionName, ActionDef<any>> = {
    [ActionName.UpdateFieldValue]: updateFieldValue,
    [ActionName.AddRecord]: addRecord,
};
