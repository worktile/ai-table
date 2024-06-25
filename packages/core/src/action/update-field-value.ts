import {
    ActionDef,
    ActionName,
    ActionOptionsBase,
    FieldPath,
    RecordPath,
} from "../types/action";

export interface UpdateFieldValueOptions extends ActionOptionsBase {
    type: ActionName.UpdateFieldValue;
    path: [RecordPath, FieldPath];
    previousData: any;
}

export const updateFieldValue: ActionDef<UpdateFieldValueOptions> = {
    execute: (context, options) => {
        context.update((value) => {
            const [recordIndex, fieldIndex] = options.path;
            const fieldId = value.fields[fieldIndex].id;
            value.records[recordIndex].value[fieldId] = options.data;
            return { ...value };
        });
        return {
            action: options,
        };
    },
};
