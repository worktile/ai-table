import {
    ActionName,
    Actions,
    AddFieldAction,
    AddRecordAction,
    AIFieldPath,
    AIFieldValuePath,
    AIRecordPath,
    AITable,
    AITableAction,
    AITableChangeOptions,
    AITableFieldType,
    AITableGrid,
    AITableQueries,
    AITableRecord
} from '@ai-table/grid';
import { AITableViewField, AITableViewRecord, AIViewTable, applyActionOps, withView, YjsAITable } from '@ai-table/shared';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { createDraft, finishDraft } from 'immer';
import { ThyAction, ThyActions } from 'ngx-tethys/action';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyInputDirective } from 'ngx-tethys/input';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { TableService } from '../../service/table.service';
import { createDefaultPositions, getCanvasDefaultValue } from '../../utils/utils';

const initViews = [
    { _id: 'view1', name: '表格视图1', isActive: true },
    { _id: 'view2', name: '表格视图2' }
];

@Component({
    selector: 'demo-ai-canvas',
    templateUrl: './canvas.component.html',
    standalone: true,
    imports: [ThyActions, ThyAction, ThyPopoverModule, FormsModule, ThyInputDirective, AITableGrid],
    providers: [TableService]
})
export class DemoCanvas implements OnInit, AfterViewInit {
    aiTable!: AIViewTable;

    plugins = [withView];

    iconRegistry = inject(ThyIconRegistry);

    sanitizer = inject(DomSanitizer);

    tableService = inject(TableService);

    constructor() {
        this.registryIcon();
    }

    ngOnInit(): void {
        this.tableService.initData(initViews);
        if (this.tableService.sharedType) {
            this.tableService.buildRenderRecords();
            this.tableService.buildRenderFields();
        } else {
            const value = getCanvasDefaultValue();
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
                const record = (draftAction as AddRecordAction).record as AITableViewRecord;
                if (!record.positions) {
                    record.positions = createDefaultPositions(this.tableService.views(), action.path[0]);
                    return finishDraft(draftAction);
                }
                return action;
            case ActionName.AddField:
                const field = (draftAction as AddFieldAction).field as AITableViewField;
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

    prevent(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable as AIViewTable;
        (this.aiTable as AIViewTable).views = this.tableService.views;
        this.tableService.setAITable(this.aiTable);
    }

    removeRecord() {
        const recordIds = ['row-1'];
        recordIds.forEach((item) => {
            const path = this.aiTable.records().findIndex((record) => record._id === item);
            Actions.removeRecord(this.aiTable, [path]);
        });
    }

    moveField() {
        const newIndex = 2;
        const selectedFieldIds = ['column-1'];
        const selectedRecords = this.aiTable.fields().filter((item) => selectedFieldIds.includes(item._id));
        selectedRecords.forEach((item) => {
            const path = AITableQueries.findPath(this.aiTable, item) as AIFieldPath;
            Actions.moveField(this.aiTable, path, [newIndex]);
        });
    }

    moveRecord() {
        const selectedRecordIds = ['row-1'];
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

    addField() {
        const field = {
            _id: 'column-40',
            name: '新增列',
            type: AITableFieldType.text
        };
        Actions.addField(this.aiTable, field, [this.aiTable.fields().length]);
    }

    editField() {
        const fieldId = 'column-1';
        const path = this.aiTable.fields().findIndex((item) => item._id === fieldId);
        const field = this.aiTable.fields().find((item) => item._id === fieldId);
        const newField = {
            ...field,
            name: '单行文本1-编辑后'
        };
        Actions.setField(this.aiTable, newField, [path]);
    }

    editRecord() {
        const fieldId = 'column-1';
        const selectedRecordId = 'row-1';
        const field = this.aiTable.fields().find((item) => item._id === fieldId);
        const selectedRecord = this.aiTable.records().find((item) => selectedRecordId === item._id);
        const newRecord = '单行文本1-编辑后';
        const path = AITableQueries.findPath(this.aiTable, field, selectedRecord) as AIFieldValuePath;
        Actions.updateFieldValue(this.aiTable, newRecord, path);
    }

    updateType() {
        const fieldId = 'column-1';
        const path = this.aiTable.fields().findIndex((item) => item._id === fieldId);
        const field = this.aiTable.fields().find((item) => item._id === fieldId);
        const newField = {
            ...field,
            name: '单行文本1-编辑后',
            type: AITableFieldType.updatedAt
        };
        Actions.setField(this.aiTable, newField, [path]);
    }
}
