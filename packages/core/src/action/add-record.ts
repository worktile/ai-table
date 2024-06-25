import {
    ActionDef,
    ActionName,
    ActionOptionsBase,
    RecordPath,
    VTableFieldType,
    VTableRecord,
    VTableValue,
} from "../types";
import { getDefaultValueByType } from "../utils";

export interface AddRecordOptions extends ActionOptionsBase {
    type: ActionName.AddRecord;
    path: [RecordPath];
    data: {
        id: string;
    };
}

export const addRecord: ActionDef<AddRecordOptions> = {
    execute: (context, options) => {
        const [recordIndex] = options.path;
        const newRecord = getNewRecord(context(), options.data.id);
        context.update((value) => {
            value.records.splice(recordIndex, 0, newRecord);
            return { ...value };
        });

        return {
            action: options,
        };
    },
};

function getNewRecord(value: VTableValue, recordId: string) {
    const newRow: VTableRecord = {
        id: recordId,
        value: {},
    };
    value.fields.map((item) => {
        newRow.value[item.id] = getDefaultValueByType(item.type);
    });
    return newRow;
}
