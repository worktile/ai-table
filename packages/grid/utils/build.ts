import { VTableValue, VTableViewType } from "../../core";
import { GridData } from "../types";

export const buildGridData = (value: VTableValue, gridId: string): GridData => {
    return {
        id: gridId,
        type: VTableViewType.Grid,
        fields: value.fields,
        records: value.records,
    };
};
