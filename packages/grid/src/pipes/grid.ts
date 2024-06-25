import { Pipe, PipeTransform } from "@angular/core";
import { SelectOption } from "@v-table/core";

@Pipe({
    name: "selectOption",
    standalone: true,
})
export class SelectOptionPipe implements PipeTransform {
    transform(id: string, options: SelectOption[]) {
        return options.find((item) => item.id === id);
    }
}
