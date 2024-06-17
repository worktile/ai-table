import { AddColumn } from "../action/add-column";
import { AddRecord } from "../action/add-record";
import { updateFieldValue } from "../action/update-field-value";
import { ActionDef, ActionName } from "../types/actions";

export const ACTION_MAP: { [name: string]: ActionDef } = {
    [ActionName.UpdateFieldValue]: updateFieldValue,
    [ActionName.AddRecord]: AddRecord,
    [ActionName.AddColumn]: AddColumn,
};
