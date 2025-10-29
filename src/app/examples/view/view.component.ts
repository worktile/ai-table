import { Component, computed, inject, signal } from '@angular/core';
import { ViewsExample } from './views/views.component';
import { ViewService } from './view.service';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { AITable, AITableField, AITableRecord, AITableReferences } from '@ai-table/utils';
import { AITableGrid } from '@ai-table/grid';
import { AIViewTable, withState } from '@ai-table/state';
import { helpers } from 'ngx-tethys/util';
import { mockFields, mockRecords, mockReferences } from './mock';

@Component({
    selector: 'app-table-view-example',
    templateUrl: './view.component.html',
    imports: [ViewsExample, AITableGrid, ThyPopoverModule],
    providers: [ViewService],
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class TableViewExample {
    private viewService = inject(ViewService);

    aiTable!: AIViewTable;

    fields = signal<AITableField[]>(mockFields);

    records = signal<AITableRecord[]>(mockRecords);

    references = signal<AITableReferences>(mockReferences);

    plugins = [withState];

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable as AIViewTable;
        this.aiTable.onChange = () => {};

        this.aiTable.activeViewId = this.viewService.activeViewId;
        this.aiTable.views = this.viewService.views;
        this.aiTable.viewsMap = computed(() => {
            return helpers.keyBy(this.viewService.views(), '_id');
        });
    }
}
