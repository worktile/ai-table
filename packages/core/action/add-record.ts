import { signal } from "@angular/core";
import { ActionDef, ActionName } from "../types/actions";
import { ResourceType } from "../types/core";
import { ColumnType, GridData } from "../types";

export interface AddRecordOptions {
    type: ActionName.AddRecord;
    data: {
        id: string;
    };
}

export const AddRecord: ActionDef<any, AddRecordOptions> = {
    execute: (context, options) => {
        const data = signal(context.data);
        const newRecord = getNewRecord(data(), options.data.id);
        data.update((value) => {
            value.rows.push(newRecord);
            return value;
        });

        return {
            resourceType: ResourceType.grid,
            data: data(),
            actions: options,
        };
    },
};

function getNewRecord(value: GridData, recordId: string) {
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
