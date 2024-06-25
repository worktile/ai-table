import { VTableValue, VTableViewType } from "@v-table/core";
import { GridData, GridView } from "../types";

export const buildGridData = (value: VTableValue, gridView: GridView): GridData => {
    return {
        id: gridView.id,
        type: VTableViewType.Grid,
        fields: value.fields,
        records: value.records,
    };
};
