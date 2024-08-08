import { Pipe, PipeTransform } from '@angular/core';
import { AITableSelectOption } from '../core';
import { AITableSelection } from '../types';

@Pipe({
    name: 'selectOption',
    standalone: true
})
export class SelectOptionPipe implements PipeTransform {
    transform(_id: string, options: AITableSelectOption[]) {
        return options.find((item) => item._id === _id);
    }
}

@Pipe({
    name: 'isSelectRecord',
    standalone: true
})
export class IsSelectRecordPipe implements PipeTransform {
    transform(recordId: string, selection: AITableSelection) {
        return selection.selectedRecords.has(recordId);
    }
}
