import {
    Actions,
    AIFieldConfig,
    AITable,
    AITableField,
    AITableFields,
    AITableFieldType,
    AITableGrid,
    AITableRecords,
    DividerMenuItem,
    EditFieldPropertyItem,
    RemoveFieldItem
} from '@ai-table/grid';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    isDevMode,
    OnDestroy,
    OnInit,
    Signal,
    signal,
    WritableSignal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ThyAction } from 'ngx-tethys/action';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyPopover } from 'ngx-tethys/popover';
import { ThySelect } from 'ngx-tethys/select';
import { ThyOption } from 'ngx-tethys/shared';
import { WebsocketProvider } from 'y-websocket';
import { CustomActions } from './action';
import { FieldPropertyEditor } from './component/field-property-editor/field-property-editor.component';
import { withCustomApply } from './plugins/custom-action.plugin';
import { applyYjsEvents } from './share/apply-to-table';
import applyActionOps from './share/apply-to-yjs';
import { connectProvider } from './share/provider';
import { getSharedType, SharedType } from './share/shared';
import { translateSharedTypeToTable } from './share/utils/translate-to-table';
import { YjsAITable } from './share/yjs-table';
import { AITableView, AIViewTable, RowHeight } from './types/view';

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
//         name: '文本',
//         type: AITableFieldType.text,
//     });
// }
// initValue.records = [];
// for (let index = 0; index < 40 * 3 * 2 * 30; index++) {
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
    imports: [RouterOutlet, AITableGrid, FieldPropertyEditor, ThySelect, FormsModule, ThyOption, ThyAction],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
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

    sharedType!: SharedType | null;

    provider!: WebsocketProvider | null;

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
        this.initSharedType();
        console.time('render');
    }

    initSharedType() {
        const isInitializeSharedType = false;
        this.sharedType = getSharedType(
            {
                records: this.records(),
                fields: this.fields()
            },
            !!isInitializeSharedType
        );
        let isInitialized = false;
        this.provider = connectProvider(this.sharedType.doc!, isDevMode());
        this.sharedType.observeDeep((events: any) => {
            if (!YjsAITable.isLocal(this.aiTable)) {
                if (!isInitialized) {
                    const data = translateSharedTypeToTable(this.sharedType!);
                    this.records.set(data.records);
                    this.fields.set(data.fields);
                    isInitialized = true;
                } else {
                    applyYjsEvents(this.aiTable, events);
                }
            }
        });
        if (!isInitializeSharedType) {
            localStorage.setItem('ai-table-shared-type', 'true');
        }
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
        if (this.provider) {
            if (!YjsAITable.isRemote(this.aiTable) && !YjsAITable.isUndo(this.aiTable)) {
                YjsAITable.asLocal(this.aiTable, () => {
                    applyActionOps(this.sharedType!, data.actions, this.aiTable);
                });
            }
        }
    }

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable;
        (this.aiTable as AIViewTable).views = this.views;
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

    disconnect() {
        if (this.provider) {
            this.provider.disconnect();
            this.provider = null;
        }
    }

    ngOnDestroy(): void {
        this.disconnect();
    }
}
