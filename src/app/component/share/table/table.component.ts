import { AITable, AITableAction, AITableChangeOptions, AITableGrid } from '@ai-table/grid';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThyAction } from 'ngx-tethys/action';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { CommonTableComponent } from '../../common/table.component';
import { FieldPropertyEditor } from '../../common/field-property-editor/field-property-editor.component';
import applyActionOps from '../../../share/apply-to-yjs';
import { YjsAITable } from '../../../share/yjs-table';
import { FormsModule } from '@angular/forms';
import { ThyInputDirective } from 'ngx-tethys/input';
import { setActiveViewPositions } from '../../../utils/utils';
import { DemoAIField, DemoAIRecord, UpdateFieldTypes, UpdateRecordTypes } from '../../../types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableService } from '../../../service/table.service';

@Component({
    selector: 'ai-share-table-demo',
    standalone: true,
    imports: [
        RouterOutlet,
        CommonTableComponent,
        AITableGrid,
        ThyPopoverModule,
        FieldPropertyEditor,
        ThyAction,
        FormsModule,
        ThyInputDirective
    ],
    templateUrl: './table.component.html'
})
export class ShareTableComponent extends CommonTableComponent {
    takeUntilDestroyed = takeUntilDestroyed();

    override ngOnInit(): void {
        this.tableService.activeViewChange$.pipe(this.takeUntilDestroyed).subscribe(() => {
            this.tableService.setRecords();
            this.tableService.setFields();
        });
        console.time('render');
    }

    override aiTableInitialized(aiTable: AITable) {
        super.aiTableInitialized(aiTable);
        this.tableService.setAITable(aiTable);
    }

    override setPositions(actions: AITableAction[]) {
        if (actions.some((item) => UpdateRecordTypes.includes(item.type))) {
            const records = setActiveViewPositions(this.tableService.records(), this.tableService.activeView().id) as DemoAIRecord[];
            this.tableService.setRecords(records);
        }
        if (actions.some((item) => UpdateFieldTypes.includes(item.type))) {
            const fields = setActiveViewPositions(this.tableService.fields(), this.tableService.activeView().id) as DemoAIField[];
            this.tableService.setFields(fields);
        }
    }

    override onChange(data: AITableChangeOptions) {
        this.setPositions(data.actions);
        if (this.tableService.sharedType) {
            if (!YjsAITable.isRemote(this.aiTable) && !YjsAITable.isUndo(this.aiTable)) {
                YjsAITable.asLocal(this.aiTable, () => {
                    applyActionOps(this.tableService.sharedType!, data.actions, this.aiTable);
                });
            }
        }
    }
}
