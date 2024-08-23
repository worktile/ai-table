import { ActionName, AddFieldAction, AddRecordAction, AITable, AITableChangeOptions, AITableGridRenderer } from '@ai-table/grid';
import { AITableViewField, AITableViewRecord, AIViewTable, applyActionOps, withView, YjsAITable } from '@ai-table/shared';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { createDraft, finishDraft } from 'immer';
import { TableService } from '../../../service/table.service';
import { createDefaultPositions, getDefaultValue, getReferences } from '../../../utils/utils';
import { ThyAction } from 'ngx-tethys/action';
import { FormsModule } from '@angular/forms';
import { ThyInputDirective } from 'ngx-tethys/input';

@Component({
    selector: 'demo-canvas-table-content',
    standalone: true,
    imports: [AITableGridRenderer, ThyAction, FormsModule, ThyInputDirective],
    templateUrl: './content.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class DemoCanvasTableContent implements OnInit {
    aiTable!: AIViewTable;

    tableService = inject(TableService);

    plugins = [withView];

    references = signal(getReferences());

    ngOnInit(): void {
        if (this.tableService.sharedType) {
            this.tableService.buildRenderRecords();
            this.tableService.buildRenderFields();
        } else {
            const value = getDefaultValue();
            this.tableService.buildRenderRecords(value.records);
            this.tableService.buildRenderFields(value.fields);
        }
    }

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable as AIViewTable;
        this.aiTable.views = this.tableService.views;
        this.tableService.setAITable(this.aiTable);
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

    prevent(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    removeRecord() {}

    moveRecord() {}

    moveField() {}
}
