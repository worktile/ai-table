import { signal } from "@angular/core";
import { ActionDef, ActionName } from "../types/actions";
import { ResourceType } from "../types/core";

export interface UpdateFieldValueOptions {
    type: ActionName.UpdateFieldValue;
    recordId: string;
    fieldId: string;
    data: any;
    previousData: any;
}

export const updateFieldValue: ActionDef<any, UpdateFieldValueOptions> = {
    execute: (context, options) => {
        const { recordId, fieldId } = options;
        const data = signal(context.data);
        data.update((value: { rows: any[] }) => {
            const row = value.rows.find(
                (item: { id: string }) => item.id === recordId
            );
            if (row) {
                row.value[fieldId] = options.data;
            }
            return value;
        });
        return {
            resourceType: ResourceType.grid,
            data: data(),
            actions: options,
        };
    },
};
