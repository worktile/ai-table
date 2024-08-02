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
import { setActiveViewPositions, setLocalData } from '../../../utils/utils';
import { ShareService } from '../../../service/share.service';
import { DemoAIField, DemoAIRecord, UpdateFieldTypes, UpdateRecordTypes } from '../../../types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    shareService = inject(ShareService);

    takeUntilDestroyed = takeUntilDestroyed();

    override ngOnInit(): void {
        this.viewService.activeViewChange$.pipe(this.takeUntilDestroyed).subscribe(() => {
            this.shareService.setRecords();
            this.shareService.setFields();
        });
        console.time('render');
    }

    override aiTableInitialized(aiTable: AITable) {
        super.aiTableInitialized(aiTable);
        this.shareService.setAITable(aiTable);
    }

    override setPositions(actions: AITableAction[]) {
        if (actions.some((item) => UpdateRecordTypes.includes(item.type))) {
            const records = setActiveViewPositions(this.shareService.records(), this.viewService.activeView().id) as DemoAIRecord[];
            this.shareService.setRecords(records);
        }
        if (actions.some((item) => UpdateFieldTypes.includes(item.type))) {
            const fields = setActiveViewPositions(this.shareService.fields(), this.viewService.activeView().id) as DemoAIField[];
            this.shareService.setFields(fields);
        }
    }

    override onChange(data: AITableChangeOptions) {
        this.setPositions(data.actions);
        setLocalData(
            JSON.stringify({
                fields: this.shareService.fields(),
                records: this.shareService.records()
            })
        );
        if (this.shareService.sharedType) {
            if (!YjsAITable.isRemote(this.aiTable) && !YjsAITable.isUndo(this.aiTable)) {
                YjsAITable.asLocal(this.aiTable, () => {
                    applyActionOps(this.shareService.sharedType!, data.actions, this.aiTable);
                });
            }
        }
    }
}
