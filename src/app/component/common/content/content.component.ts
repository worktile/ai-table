import {
    ActionName,
    Actions,
    AddFieldAction,
    AddRecordAction,
    AIFieldConfig,
    AIFieldPath,
    AIRecordPath,
    AITable,
    AITableAction,
    AITableChangeOptions,
    AITableField,
    AITableGrid,
    AITableQueries,
    AITableRecord,
    DividerMenuItem,
    EditFieldPropertyItem,
    RemoveFieldItem
} from '@ai-table/grid';
import { Component, inject, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThyAction } from 'ngx-tethys/action';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { FormsModule } from '@angular/forms';
import { ThyInputDirective } from 'ngx-tethys/input';
import { DomSanitizer } from '@angular/platform-browser';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { withCustomApply } from '../../../plugins/custom-action.plugin';
import { TableService } from '../../../service/table.service';
import applyActionOps from '../../../share/apply-to-yjs';
import { YjsAITable } from '../../../share/yjs-table';
import { AIViewTable, Direction } from '../../../types/view';
import { createDefaultPositions, getDefaultValue } from '../../../utils/utils';
import { FieldPropertyEditor } from '../field-property-editor/field-property-editor.component';
import { CustomActions } from '../../../action';
import { DemoAIField, DemoAIRecord } from '../../../types';
import { createDraft, finishDraft } from 'immer';

@Component({
    selector: 'demo-table-content',
    standalone: true,
    imports: [RouterOutlet, AITableGrid, ThyPopoverModule, FieldPropertyEditor, ThyAction, FormsModule, ThyInputDirective],
    templateUrl: './content.component.html'
})
export class DemoTableContent {
    aiTable!: AITable;

    plugins = [withCustomApply];

    listOfOption = [
        {
            value: 'short',
            name: 'short'
        },
        {
            value: 'medium',
            name: 'medium'
        },
        {
            value: 'tall',
            name: 'tall'
        }
    ];

    aiFieldConfig: AIFieldConfig = {
        fieldPropertyEditor: FieldPropertyEditor,
        fieldMenus: [
            EditFieldPropertyItem,
            DividerMenuItem,
            {
                _id: 'filterFields',
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

    tableService = inject(TableService);

    constructor() {
        this.registryIcon();
    }

    ngOnInit(): void {
        if (this.tableService.sharedType) {
            this.tableService.buildRenderRecords();
            this.tableService.buildRenderFields();
        } else {
            const value = getDefaultValue();
            this.tableService.buildRenderRecords(value.records);
            this.tableService.buildRenderFields(value.fields);
        }
        console.time('render');
    }

    ngAfterViewInit() {
        console.timeEnd('render');
    }

    registryIcon() {
        this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/defs/svg/sprite.defs.svg'));
    }

    buildAction(action: AITableAction) {
        // TODO：获取当前的 view 和 path，转换为 sharedType 中原数据的 path
        let draftAction = createDraft(action);
        switch (action.type) {
            case ActionName.AddRecord:
                const record = (draftAction as AddRecordAction).record as DemoAIRecord;
                if (!record.positions) {
                    record.positions = createDefaultPositions(this.tableService.views(), action.path[0]);
                    return finishDraft(draftAction);
                }
                return action;
            case ActionName.AddField:
                const field = (draftAction as AddFieldAction).field as DemoAIField;
                if (!field.positions) {
                    field.positions = createDefaultPositions(this.tableService.views(), action.path[0]);
                    return finishDraft(draftAction);
                }
                return action;
            default:
                return action;
        }
    }

    onChange(options: AITableChangeOptions) {
        if (this.tableService.sharedType) {
            options.actions = options.actions.map((action) => {
                return this.buildAction(action);
            });
            if (!YjsAITable.isRemote(this.aiTable) && !YjsAITable.isUndo(this.aiTable)) {
                YjsAITable.asLocal(this.aiTable, () => {
                    applyActionOps(this.tableService.sharedType!, options.actions, this.aiTable);
                });
            }
        }
    }

    sort() {
        const direction = this.tableService.activeView().sortCondition?.conditions[0].direction;
        const sortCondition = {
            keepSort: false,
            conditions: [{ sortBy: 'column-4', direction: direction === Direction.ascending ? Direction.descending : Direction.ascending }]
        };
        const index = this.tableService.views().indexOf(this.tableService.activeView());
        CustomActions.setView(this.aiTable as any, { sortCondition }, [index]);
    }

    prevent(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable;
        (this.aiTable as AIViewTable).views = this.tableService.views;
        this.tableService.setAITable(aiTable);
    }

    removeRecord() {
        const recordIds = [...this.aiTable.selection().selectedRecords.keys()];
        recordIds.forEach((item) => {
            const path = this.aiTable.records().findIndex((record) => record._id === item);
            Actions.removeRecord(this.aiTable, [path]);
        });
    }

    moveField() {
        const newIndex = 2;
        const selectedFieldIds = [...this.aiTable.selection().selectedFields.keys()];
        const selectedRecords = this.aiTable.fields().filter((item) => selectedFieldIds.includes(item._id));
        selectedRecords.forEach((item) => {
            const path = AITableQueries.findPath(this.aiTable, item) as AIFieldPath;
            Actions.moveField(this.aiTable, path, [newIndex]);
        });
    }

    moveRecord() {
        const selectedRecordIds = [...this.aiTable.selection().selectedRecords.keys()];
        const selectedRecords = this.aiTable.records().filter((item) => selectedRecordIds.includes(item._id));
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
