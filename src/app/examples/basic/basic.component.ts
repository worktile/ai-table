import { Component, signal } from '@angular/core';
import { AITableGrid } from '@ai-table/grid';
import { AITableRecord, AITableField, AITableReferences } from '@ai-table/utils';
import { mockRecords, mockFields, mockReferences } from './mock';

@Component({
    selector: 'app-table-basic-example',
    templateUrl: './basic.component.html',
    imports: [AITableGrid],
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class TableBasicExample {
    fields = signal<AITableField[]>(mockFields);

    records = signal<AITableRecord[]>(mockRecords);

    references = signal<AITableReferences>(mockReferences);
}
