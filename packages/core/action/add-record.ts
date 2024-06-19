import { signal } from "@angular/core";
import { ActionDef, ActionName } from "../types/actions";
import { ResourceType } from "../types/core";
import { ColumnType, GridData } from "../types";

export interface AddRecordOptions {
    type: ActionName.AddRecord;
    data: {
        index: number;
        value: any;
    };
}

export const AddRecord: ActionDef<any, AddRecordOptions> = {
    execute: (context, options) => {
        const data = context.data;
        data.update((item) => {
            item.rows.splice(options.data.index, 0, options.data.value);
            return {...item};
        });

        return {
            resourceType: ResourceType.grid,
            data: data(),
            actions: options,
        };
    },
};

export function getNewRecord(value: GridData, recordId: string) {
    const columns = value.columns;
    const newCells = columns.map((item) => {
        return {
            columnId: item.id,
            value: "",
        };
    });
    const newRow: {
        id: string;
        value: { [key: string]: any };
    } = {
        id: recordId,
        value: {},
    };
    newCells.forEach((cell) => {
        newRow.value[cell.columnId] = cell.value;
    });

    return newRow;
}
