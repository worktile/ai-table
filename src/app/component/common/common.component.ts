import {
    Actions,
    AIFieldConfig,
    AIFieldPath,
    AIRecordPath,
    AITable,
    AITableField,
    AITableFields,
    AITableFieldType,
    AITableGrid,
    AITableQueries,
    AITableRecord,
    AITableRecords,
    DividerMenuItem,
    EditFieldPropertyItem,
    RemoveFieldItem
} from '@ai-table/grid';
import { AfterViewInit, Component, computed, OnDestroy, OnInit, output, Signal, signal, WritableSignal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ThyAction } from 'ngx-tethys/action';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { CustomActions } from '../../action';
import { withCustomApply } from '../../plugins/custom-action.plugin';
import { AITableView, AIViewTable, RowHeight } from '../../types/view';
import { FieldPropertyEditor } from './field-property-editor/field-property-editor.component';

const LOCAL_STORAGE_KEY = 'ai-table-data';

const initValue = {
    records: [
        {
            id: 'row-1',
            values: {
                'column-1': '文本 1-1',
                'column-2': '1',
                'column-3': {
                    url: 'https://www.baidu.com',
                    text: '百度链接'
                },
                'column-4': 3,
                'column-5': 10
            }
        },
        {
            id: 'row-2',
            values: {
                'column-1': '文本 2-1',
                'column-2': '2',
                'column-3': {},
                'column-4': 1,
                'column-5': 20
            }
        },
        {
            id: 'row-3',
            values: {
                'column-1': '文本 3-1',
                'column-2': '3',
                'column-3': {},
                'column-4': 1,
                'column-5': 50
            }
        }
    ],
    fields: [
        {
            id: 'column-1',
            name: '文本',
            type: AITableFieldType.text
        },
        {
            id: 'column-2',
            name: '单选',
            type: AITableFieldType.select,
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
            type: AITableFieldType.link
        },
        {
            id: 'column-4',
            name: '评分',
            type: AITableFieldType.rate
        },
        {
            id: 'column-5',
            name: '进度',
            type: AITableFieldType.progress
        }
    ]
};

// console.time('build data');
// initValue.fields = [];
// for (let index = 0; index < 5; index++) {
//     initValue.fields.push({
//         id: `column-${index}`,
//         name: "文本",
//         type: AITableFieldType.text,
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
    selector: 'ai-table-common',
    standalone: true,
    imports: [RouterOutlet, AITableGrid, ThyPopoverModule, FieldPropertyEditor, ThyAction],
    template: ''
})
export class CommonComponent implements OnInit, AfterViewInit, OnDestroy {
    records!: WritableSignal<AITableRecords>;

    fields!: WritableSignal<AITableFields>;

    aiTable!: AITable;

    views = signal([
        { rowHeight: RowHeight.short, id: 'view1', name: '表格1', isActive: true },
        { rowHeight: RowHeight.short, id: '3', name: '表格视图3' }
    ]);

    plugins = [withCustomApply];

    listOfOption = [
        {
            value: 'short',
            text: 'short'
        },
        {
            value: 'medium',
            text: 'medium'
        },
        {
            value: 'tall',
            text: 'tall'
        }
    ];

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
            },
            DividerMenuItem,
            RemoveFieldItem
        ]
    };

    activeView = computed(() => {
        return { ...this.views().find((view) => view?.isActive) } as AITableView;
    });

    tableInitialized = output<AITable>();

    constructor(
        private iconRegistry: ThyIconRegistry,
        private sanitizer: DomSanitizer
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
        (this.aiTable as AIViewTable).views = this.views;
        this.tableInitialized.emit(this.aiTable);
    }

    setLocalData(data: string) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}`, data);
    }

    getLocalStorage() {
        const data = localStorage.getItem(`${LOCAL_STORAGE_KEY}`);
        return data ? JSON.parse(data) : initValue;
    }

    changeRowHeight(event: string) {
        CustomActions.setView(this.aiTable as any, this.activeView(), [0]);
    }

    removeRecord() {
        const recordIds = [...this.aiTable.selection().selectedRecords.keys()];
        recordIds.forEach((item) => {
            const path = this.aiTable.records().findIndex((record) => record.id === item);
            Actions.removeRecord(this.aiTable, [path]);
        });
    }

    moveField() {
        const newIndex = 2;
        const selectedFieldIds = [...this.aiTable.selection().selectedFields.keys()];
        const selectedRecords = this.aiTable.fields().filter((item) => selectedFieldIds.includes(item.id));
        selectedRecords.forEach((item) => {
            const path = AITableQueries.findPath(this.aiTable, item) as AIFieldPath;
            Actions.moveField(this.aiTable, path, [newIndex]);
        });
    }

    moveRecord() {
        const selectedRecordIds = [...this.aiTable.selection().selectedRecords.keys()];
        const selectedRecords = this.aiTable.records().filter((item) => selectedRecordIds.includes(item.id));
        const selectedRecordsAfterNewPath: AITableRecord[] = [];
        let offset = 0;
        const newIndex = 2;
        selectedRecords.forEach((item) => {
            const path = AITableQueries.findPath(this.aiTable, undefined, item) as AIRecordPath;
            if (path[0] < newIndex) {
                Actions.moveRecord(this.aiTable, path, [newIndex]);
                offset = 1;
            } else {
                selectedRecordsAfterNewPath.push(item);
            }
        });

        selectedRecordsAfterNewPath.reverse().forEach((item) => {
            const newPath = [newIndex + offset] as AIRecordPath;
            const path = AITableQueries.findPath(this.aiTable, undefined, item) as AIRecordPath;
            Actions.moveRecord(this.aiTable, path, newPath);
        });
    }

    ngOnDestroy(): void {}
}
