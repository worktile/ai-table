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
import { Component, inject, signal, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThyAction } from 'ngx-tethys/action';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { FormsModule } from '@angular/forms';
import { ThyInputDirective } from 'ngx-tethys/input';
import { DomSanitizer } from '@angular/platform-browser';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { TableService } from '../../../service/table.service';
import { createDefaultPositions, getDefaultValue, getReferences } from '../../../utils/utils';
import { FieldPropertyEditor } from '../field-property-editor/field-property-editor.component';
import { createDraft, finishDraft } from 'immer';
import {
    AITableViewField,
    AITableViewRecord,
    applyActionOps,
    ViewActions,
    Direction,
    AIViewTable,
    YjsAITable,
    withView
} from '@ai-table/shared';

@Component({
    selector: 'demo-table-content',
    standalone: true,
    imports: [RouterOutlet, AITableGrid, ThyPopoverModule, FieldPropertyEditor, ThyAction, FormsModule, ThyInputDirective],
    templateUrl: './content.component.html'
})
export class DemoTableContent {
    aiTable!: AIViewTable;

    plugins = [withView];

    aiFieldConfig: AIFieldConfig = {
        fieldPropertyEditor: FieldPropertyEditor,
        fieldMenus: [
            EditFieldPropertyItem,
            DividerMenuItem,
            {
                type: 'filterFields',
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

    references = signal(getReferences());

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

    onChange(options: AITableChangeOptions) {
        if (this.tableService.sharedType) {
            options.actions = options.actions.map((action) => {
                if (action.type === ActionName.AddRecord) {
                    const draftAction = createDraft(action);
                    const record = (draftAction as AddRecordAction).record as AITableViewRecord;
                    if (!record.positions) {
                        record.positions = createDefaultPositions(this.tableService.views(), this.tableService.records(), action.path[0]);
                        const newAction = finishDraft(draftAction) as AddRecordAction;
                        this.tableService.records.update((value) => {
                            let draftValue = createDraft(value);
                            draftValue[action.path[0]] = newAction.record as AITableViewRecord;
                            return finishDraft(draftValue);
                        });
                        return newAction;
                    }
                }
                if (action.type === ActionName.AddField) {
                    const draftAction = createDraft(action);
                    const field = (draftAction as AddFieldAction).field as AITableViewField;
                    if (!field.positions) {
                        field.positions = createDefaultPositions(this.tableService.views(), this.tableService.fields(), action.path[0]);
                        const newAction = finishDraft(draftAction) as AddFieldAction;
                        this.tableService.fields.update((value) => {
                            let draftValue = createDraft(value);
                            draftValue[action.path[0]] = newAction.field as AITableViewField;
                            return finishDraft(draftValue);
                        });
                        return newAction;
                    }
                }
                return action;
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
        ViewActions.setView(this.aiTable as any, { sortCondition }, [index]);
    }

    prevent(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable as AIViewTable;
        this.aiTable.views = this.tableService.views;
        this.tableService.setAITable(this.aiTable);
    }

    removeRecord() {
        const recordIds = [...this.aiTable.selection().selectedRecords.keys()];
        recordIds.forEach((id) => {
            Actions.removeRecord(this.aiTable, [id]);
        });
    }

    moveField() {
        const newIndex = 2;
        const selectedFieldIds = [...this.aiTable.selection().selectedFields.keys()];
        const selectedFields = this.aiTable.fields().filter((item) => selectedFieldIds.includes(item._id));
        selectedFields.forEach((item) => {
            const path = AITableQueries.findFieldPath(this.aiTable, item) as AIFieldPath;
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
            const path = AITableQueries.findRecordPath(this.aiTable, item) as AIRecordPath;
            if (path[0] < newIndex) {
                Actions.moveRecord(this.aiTable, path, [newIndex]);
                offset = 1;
            } else {
                selectedRecordsAfterNewPath.push(item);
            }
        });

        selectedRecordsAfterNewPath.reverse().forEach((item) => {
            const newPath = [newIndex + offset] as AIRecordPath;
            const path = AITableQueries.findRecordPath(this.aiTable, item) as AIRecordPath;
            Actions.moveRecord(this.aiTable, path, newPath);
        });
    }
}
