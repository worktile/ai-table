import { Component, OnInit, signal } from '@angular/core';
import { AITableGrid } from '@ai-table/grid';

import { AITableFieldType, AITableRecord } from '@ai-table/utils';
import { ThyPopoverModule } from 'ngx-tethys/popover';

@Component({
    selector: 'app-basic-table-example',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    imports: [AITableGrid, ThyPopoverModule],
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class BasicTableExample implements OnInit {
    fields = signal([
        {
            _id: 'name',
            name: '名称',
            type: AITableFieldType.text
        },
        {
            _id: 'created_at',
            name: '创建时间',
            type: AITableFieldType.date
        }
    ]);

    records = signal<AITableRecord[]>([
        {
            _id: '1',
            short_id: '1',
            created_at: 1,
            created_by: '2',
            updated_at: 3,
            updated_by: '1',
            values: {
                name: '张三'
            }
        },
        {
            _id: '2',
            short_id: '1',
            created_at: 1,
            created_by: '2',
            updated_at: 3,
            updated_by: '1',
            values: {
                name: '李四'
                // created_at: {
                //     timestamp: 1747900029
                // }
            }
        }
    ]);

    constructor() {}

    ngOnInit(): void {}
}
