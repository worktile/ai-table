import { Pipe, PipeTransform } from "@angular/core";
import { ColumnType, GridColumn } from "../types";

@Pipe({
    name: "columnProperties",
    standalone: true,
})
export class ColumnPropertiesPipe implements PipeTransform {
    //TODO: type
    transform(
        row: { [key: string]: any },
        columns: GridColumn[]
    ): { type: ColumnType; key: string; value: any; [key: string]: any }[] {
        if (!row) {
            return [];
        }
        return Object.keys(row).map((key) => {
            const column = columns.find((item) => item.id === key);
            const result = {
                type: column?.type || ColumnType.text,
                key: key,
                value: row[key],
            };
            if (result.type === ColumnType.select && column) {
                return {
                    ...result,
                    options: column["options"],
                };
            }
            return result;
        });
    }
}

@Pipe({
    name: "selectedOption",
    standalone: true,
})
export class SelectedOptionPipe implements PipeTransform {
    //TODO: optionsType
    transform(value: string, options: any[]) {
        return options.find((item) => item.value === value);
    }
}
