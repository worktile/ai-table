import { AfterViewInit, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VTableContextChangeOptions, VTableFields, VTableFieldType, VTableRecords, VTableViewType } from '@v-table/core';
import { VTableGridComponent, GridConfig } from '../../packages/grid/src';
import { GridView } from '@v-table/grid';

const LOCAL_STORAGE_KEY = 'v-table-data';

const initValue = {
    records: [
        {
            id: 'row-1',
            value: {
                'column-1': '文本 1-1',
                'column-2': '1'
            }
        },
        {
            id: 'row-2',
            value: {
                'column-1': '文本 2-1',
                'column-2': '2'
            }
        },
        {
            id: 'row-3',
            value: {
                'column-1': '文本 3-1',
                'column-2': '3'
            }
        }
    ],
    fields: [
        {
            id: 'column-1',
            name: '文本',
            type: VTableFieldType.Text
        },
        {
            id: 'column-2',
            name: '单选',
            type: VTableFieldType.SingleSelect,
            options: [
                {
                    id: '1',
                    name: '开始',
                    color: '#5dcfff'
                },
                {
                    id: '2',
                    name: '进行中',
                    color: '#ffcd5d'
                },
                {
                    id: '3',
                    name: '已完成',
                    color: '#73d897'
                }
            ]
        }
    ]
};

// console.time('build data');
// initValue.fields = [];
// for (let index = 0; index < 5; index++) {
//     initValue.fields.push({
//         id: `column-${index}`,
//         name: "文本",
//         type: VTableFieldType.Text,
//     });
// }
// initValue.records = [];
// for (let index = 0; index < 40 * 3 * 2*30; index++) {
//     const value: any = {};
//     initValue.fields.forEach((column, columnIndex) => {
//         value[`${column.id}`] = `text-${index}-${columnIndex}`;
//     });
//     initValue.records.push({
//         id: `row-${index + 1}`,
//         value: value,
//     });
// }
// console.timeEnd('build data');

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, VTableGridComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
    gridConfig: WritableSignal<GridConfig> = signal({
        cellRenderer: {
            // [VTableFieldType.SingleSelect]: {
            //     view: SelectComponent,
            //     edit: SelectComponent,
            // },
        }
    });

    recordsValue!: WritableSignal<VTableRecords>;

    fieldsValue!: WritableSignal<VTableFields>;

    gridView!: WritableSignal<GridView>;

    constructor() {}

    ngOnInit(): void {
        const value = this.getLocalStorage();
        this.recordsValue = signal(value.records);
        this.fieldsValue = signal(value.fields);
        this.gridView = signal({
            id: 'grid-1',
            type: VTableViewType.Grid
        });
        console.time('render');
    }

    ngAfterViewInit() {
        console.timeEnd('render');
    }

    contextChange(data: VTableContextChangeOptions<any>) {
        localStorage.setItem(
            `${LOCAL_STORAGE_KEY}`,
            JSON.stringify({
                fields: data.fields,
                records: data.records
            })
        );
    }

    fieldsValueChange(data: VTableFields) {
        console.log('fieldsValueChange', this.fieldsValue() === data);
    }

    recordsValueChange(data: VTableRecords) {
        console.log('recordsValueChange', this.recordsValue() === data);
    }

    setLocalData(data: string) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}`, data);
    }

    getLocalStorage() {
        const data = localStorage.getItem(`${LOCAL_STORAGE_KEY}`);
        return data ? JSON.parse(data) : initValue;
    }
}
