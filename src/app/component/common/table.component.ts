import { AfterViewInit, Component, OnInit, Signal, signal, WritableSignal, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import {
    AITableGrid,
    AITableField,
    AITable,
    AIFieldConfig,
    EditFieldPropertyItem,
    DividerMenuItem,
    RemoveFieldItem,
    Actions,
    AIFieldPath,
    AIRecordPath,
    AITableQueries,
    AITableRecord,
    AITableChangeOptions,
    AITableAction
} from '@ai-table/grid';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { withCustomApply } from '../../plugins/custom-action.plugin';
import { AIViewTable } from '../../types/view';
import { FieldPropertyEditor } from './field-property-editor/field-property-editor.component';
import { ThyAction } from 'ngx-tethys/action';
import { DemoAIField, DemoAIRecord, UpdateFieldTypes, UpdateRecordTypes } from '../../types';
import { ViewService } from '../../service/view.service';
import { getLocalStorage, getSortFieldsAndRecordsByPositions, setActiveViewPositions, setLocalData } from '../../utils/utils';

@Component({
    selector: 'common-ai-table',
    standalone: true,
    imports: [RouterOutlet, AITableGrid, ThyPopoverModule, FieldPropertyEditor, ThyAction],
    template: ''
})
export class CommonTableComponent implements OnInit, AfterViewInit {
    records!: WritableSignal<DemoAIRecord[]>;

    fields!: WritableSignal<DemoAIField[]>;

    aiTable!: AITable;

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

    iconRegistry = inject(ThyIconRegistry);

    sanitizer = inject(DomSanitizer);

    viewService = inject(ViewService);

    constructor() {
        this.registryIcon();
    }

    ngOnInit(): void {
        const value = getLocalStorage();
        const { records, fields } = getSortFieldsAndRecordsByPositions(value.records, value.fields, this.viewService.activeView().id);
        this.records = signal(records);
        this.fields = signal(fields);
        console.time('render');
    }

    ngAfterViewInit() {
        console.timeEnd('render');
    }

    registryIcon() {
        this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/defs/svg/sprite.defs.svg'));
    }

    onChange(data: AITableChangeOptions) {
        this.setPositions(data.actions);
        setLocalData(
            JSON.stringify({
                fields: this.fields(),
                records: this.records()
            })
        );
    }

    prevent(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable;
        (this.aiTable as AIViewTable).views = this.viewService.views;
    }

    setPositions(actions: AITableAction[]) {
        if (actions.some((item) => UpdateRecordTypes.includes(item.type))) {
            const records = setActiveViewPositions(this.records(), this.viewService.activeView().id) as DemoAIRecord[];
            this.records.set(records);
        }
        if (actions.some((item) => UpdateFieldTypes.includes(item.type))) {
            const fields = setActiveViewPositions(this.fields(), this.viewService.activeView().id) as DemoAIField[];
            this.fields.set(fields);
        }
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
}
