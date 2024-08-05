import { Pipe, PipeTransform } from '@angular/core';
import { AITableSelectOption } from '../core';

@Pipe({
    name: 'selectOption',
    standalone: true
})
export class SelectOptionPipe implements PipeTransform {
    transform(_id: string, options: AITableSelectOption[]) {
        return options.find((item) => item._id === _id);
    }
}
