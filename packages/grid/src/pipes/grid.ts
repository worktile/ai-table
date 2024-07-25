import { Pipe, PipeTransform } from '@angular/core';
import { AITableSelectOption } from '../core';

@Pipe({
    name: 'selectOption',
    standalone: true
})
export class SelectOptionPipe implements PipeTransform {
    transform(id: string, options: AITableSelectOption[]) {
        return options.find((item) => item.id === id);
    }
}
