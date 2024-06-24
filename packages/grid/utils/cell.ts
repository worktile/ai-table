import { VTableField, VTableRecord } from "../../core";
import { GridData } from "../types";

export function getCellInfo(
    value: GridData,
    fieldId: string,
    recordId: string,
): {
    field: VTableField;
    record: VTableRecord;
} {
    const field = value.fields.find((item) => item.id === fieldId)!;
    const record = value.records.find((item) => item.id === recordId)!;
    return {
        field,
        record,

    };
}
