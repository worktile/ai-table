import { ActionName, AddFieldAction, AddRecordAction, AITable, AITableAction, AITableChangeOptions, KonvaGridView } from '@ai-table/grid';
import { AITableViewField, AITableViewRecord, AIViewTable, applyActionOps, withView, YjsAITable } from '@ai-table/shared';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { createDraft, finishDraft } from 'immer';
import { ThyAction } from 'ngx-tethys/action';
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
    imports: [ThyAction, ThyPopoverModule, FormsModule, ThyInputDirective, KonvaGridView],
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

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable as AIViewTable;
        (this.aiTable as AIViewTable).views = this.tableService.views;
        this.tableService.setAITable(this.aiTable);
    }
}
