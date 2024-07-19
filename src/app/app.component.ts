import { AfterViewInit, Component, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import {
    AITableFields,
    AITableFieldType,
    AITableGrid,
    AITableRecords,
    AITableField,
    AITable,
    AIFieldConfig,
    EditFieldPropertyItem,
    DividerMenuItem
} from '@ai-table/grid';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyPopover, ThyPopoverModule } from 'ngx-tethys/popover';
import { FieldPropertyEditor } from './component/field-property-editor/field-property-editor.component';

const LOCAL_STORAGE_KEY = 'ai-table-data';

const initValue = {
    records: [
        {
            id: 'row-1',
            value: {
                'column-1': '文本 1-1',
                'column-2': '1',
                'column-3': {
                    url: 'https://www.baidu.com',
                    text: '百度链接'
                },
                'column-4': 3
            }
        },
        {
            id: 'row-2',
            value: {
                'column-1': '文本 2-1',
                'column-2': '2',
                'column-3': {},
                'column-4': 1
            }
        },
        {
            id: 'row-3',
            value: {
                'column-1': '文本 3-1',
                'column-2': '3',
                'column-3': {},
                'column-4': null
            }
        }
    ],
    fields: [
        {
            id: 'column-1',
            name: '文本',
            icon: 'text',
            type: AITableFieldType.Text
        },
        {
            id: 'column-2',
            name: '单选',
            icon: 'check-circle',
            type: AITableFieldType.SingleSelect,
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
        },
        {
            id: 'column-3',
            name: '链接',
            icon: 'link-insert',
            type: AITableFieldType.Link
        },
        {
            id: 'column-4',
            name: '评分',
            icon: 'star-circle',
            type: AITableFieldType.Rating
        }
    ]
};

// console.time('build data');
// initValue.fields = [];
// for (let index = 0; index < 5; index++) {
//     initValue.fields.push({
//         id: `column-${index}`,
//         name: "文本",
//         type: AITableFieldType.Text,
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
    imports: [RouterOutlet, AITableGrid, ThyPopoverModule, FieldPropertyEditor],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
    records!: WritableSignal<AITableRecords>;

    fields!: WritableSignal<AITableFields>;

    aiTable!: AITable;

    aiFieldConfig: AIFieldConfig = {
        fieldPropertyEditor: FieldPropertyEditor,
        fieldMenus: [
            EditFieldPropertyItem,
            DividerMenuItem,
            {
                id: 'filterFields',
                name: '按本列筛选',
                icon: 'filter-line',
                exec: (aiTable: AITable, field: Signal<AITableField>) => {},
                hidden: (aiTable: AITable, field: Signal<AITableField>) => false,
                disabled: (aiTable: AITable, field: Signal<AITableField>) => false
            }
        ]
    };

    constructor(
        private iconRegistry: ThyIconRegistry,
        private sanitizer: DomSanitizer,
        private thyPopover: ThyPopover
    ) {
        this.registryIcon();
    }

    ngOnInit(): void {
        const value = this.getLocalStorage();
        this.records = signal(value.records);
        this.fields = signal(value.fields);
        console.time('render');
    }

    registryIcon() {
        this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/defs/svg/sprite.defs.svg'));
    }

    ngAfterViewInit() {
        console.timeEnd('render');
    }

    onChange(data: any) {
        localStorage.setItem(
            `${LOCAL_STORAGE_KEY}`,
            JSON.stringify({
                fields: data.fields,
                records: data.records
            })
        );
    }

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    setLocalData(data: string) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}`, data);
    }

    getLocalStorage() {
        const data = localStorage.getItem(`${LOCAL_STORAGE_KEY}`);
        return data ? JSON.parse(data) : initValue;
    }
}
