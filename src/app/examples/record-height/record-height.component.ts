import { Component, computed, inject, signal } from '@angular/core';
import { AITable, AITableField, AITableRecord, AITableReferences } from '@ai-table/utils';
import { AITableGrid } from '@ai-table/grid';
import { AIViewTable, withState, Actions } from '@ai-table/state';
import { helpers } from 'ngx-tethys/util';
import { AITableRecordHeightType } from '@ai-table/utils';
import { TableRecordHeightSelectorExample } from './height-selector/height-selector.component';
import { ViewService } from '../view/views';
import { mockFields, mockRecords, mockReferences, mockViews } from './mock';

@Component({
    selector: 'ai-table-record-height',
    templateUrl: './record-height.component.html',
    imports: [AITableGrid, TableRecordHeightSelectorExample],
    providers: [ViewService]
})
export class TableRecordHeightExample {
    private viewService = inject(ViewService);

    aiTable!: AIViewTable;

    fields = signal<AITableField[]>(mockFields);

    records = signal<AITableRecord[]>(mockRecords);

    references = signal<AITableReferences>(mockReferences);

    plugins = [withState];

    readonly recordHeight = computed(() => {
        // Look: get record_height_type from current view settings
        return this.viewService.activeView()?.settings?.record_height_type || AITableRecordHeightType.low;
    });

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable as AIViewTable;
        this.aiTable.onChange = () => {};

        this.aiTable.activeViewId = this.viewService.activeViewId;
        this.aiTable.views = this.viewService.views;
        this.aiTable.viewsMap = computed(() => {
            return helpers.keyBy(this.viewService.views(), '_id');
        });

        this.viewService.setViews(mockViews);
        this.viewService.setActiveView(mockViews[0]._id);
    }

    recordHeightChange(height: AITableRecordHeightType) {
        // Look: update record_height_type in view settings
        Actions.setRecordHeightType(this.aiTable, height);
    }
}
