import { Pipe, PipeTransform } from '@angular/core';
import { VTableSelectOption }  from '../core';;

@Pipe({
    name: 'selectOption',
    standalone: true
})
export class SelectOptionPipe implements PipeTransform {
    transform(id: string, options: VTableSelectOption[]) {
        return options.find((item) => item.id === id);
    }
}
