import { AfterViewInit, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VTableFieldType, VTableValue } from '@v-table/core';
import { VTableGridComponent, GridConfig } from '../../packages/grid/src';

const LOCAL_STORAGE_KEY = 'v-table-data';

const initValue: VTableValue = {
    id: '1',
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

// const initValue = {
//     id: "grid",
//     name: "表格视图",
//     fields: [
//         {
//             id: "column-1",
//             name: "文本",
//             type: VTableFieldType.Text,
//         },
//     ],
//     records: [
//         {
//             id: "row-0",
//             value: {
//                 "column-1": "文本 1-1",
//                 "column-2": "1",
//                 "column-3": "文本 1-1",
//                 "column-4": "1",
//                 "column-5": "文本 1-1",
//                 "column-6": "1",
//                 "column-7": "文本 1-1",
//                 "column-8": "1",
//                 "column-9": "文本 1-1",
//                 "column-10": "1",
//             },
//         },
//     ],
// };

console.time('build data');

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

console.timeEnd('build data');

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, VTableGridComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
    value!: WritableSignal<VTableValue>;

    gridConfig: WritableSignal<GridConfig> = signal({
        cellRenderer: {
            // [VTableFieldType.SingleSelect]: {
            //     view: SelectComponent,
            //     edit: SelectComponent,
            // },
        }
    });

    constructor() {}

    ngOnInit(): void {
        this.value = signal(this.getLocalStorage());
        console.time('render');
    }

    ngAfterViewInit() {
        console.timeEnd('render');
    }

    change(data: any) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}`, JSON.stringify(data.value));
    }

    setLocalData(data: string) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}`, data);
    }

    getLocalStorage() {
        const data = localStorage.getItem(`${LOCAL_STORAGE_KEY}`);
        return data ? JSON.parse(data) : initValue;
    }
}
