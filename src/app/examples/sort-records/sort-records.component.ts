import { Component, computed, inject, Signal, signal, ChangeDetectionStrategy } from '@angular/core';
import { AIFieldConfig, AITableGrid } from '@ai-table/grid';
import {
    AITable,
    AITableAction,
    AITableViewRecord,
    AITableReferences,
    ViewSettings,
    AITableValue,
    AITableViewField,
    AITableSort,
    MoveRecordOptions
} from '@ai-table/utils';
import {
    Actions,
    AIViewTable,
    buildRecordsByView,
    buildRecordsWithWillMoveRecords,
    buildSetRecordPositionsAction,
    moveRecords,
    sortRecordsByConditions,
    withState
} from '@ai-table/state';
import { helpers } from 'ngx-tethys/util';
import { mockFields, mockRecords, mockReferences, mockViews } from './mock';
import { CombinationSortExample } from '../common';
import { ViewService } from '../view/views';

@Component({
    selector: 'app-table-sort-records-example',
    templateUrl: './sort-records.component.html',
    imports: [AITableGrid, CombinationSortExample],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ViewService]
})
export class TableSortRecordsExample {
    aiTable!: AIViewTable;

    fields = signal<AITableViewField[]>(mockFields);

    records = signal<AITableViewRecord[]>(mockRecords);

    references = signal<AITableReferences>(mockReferences);

    plugins = [withState];

    private viewService = inject(ViewService);

    readonly isKeepSort = computed(() => {
        return this.viewService.activeView()?.settings?.is_keep_sort ?? false;
    });

    readonly sorts = computed<AITableSort[]>(() => {
        return this.viewService.activeView()?.settings?.sorts || [];
    });

    readonly fieldConfig = computed<AIFieldConfig>(() => {
        return {
            // Look：hidden row drag when keep auto sort
            hiddenRowDrag: this.isKeepSort()
        };
    });

    readonly buildRenderDataFn: Signal<() => AITableValue> = computed(() => {
        return () => {
            const renderRecords = buildRecordsByView(this.aiTable, this.records(), this.fields(), this.viewService.activeView());

            // Look：return sorted records
            return {
                records: renderRecords,
                fields: this.fields() as AITableViewField[]
            };
        };
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

    sortChange(event: { isKeepSort: boolean; sorts: AITableSort[] }) {
        const { isKeepSort, sorts } = event;
        const activeView = this.viewService.activeView();
        if (!activeView) return;

        const oldSettings = activeView.settings || {};
        const newSettings: ViewSettings = {
            ...oldSettings,
            is_keep_sort: sorts.length === 0 ? false : isKeepSort,
            sorts: sorts
        };

        // Look：update is_keep_sort and sorts in view settings
        Actions.setView(this.aiTable, { settings: newSettings }, [activeView._id]);

        if (!newSettings.is_keep_sort) {
            this.manualSortRecords();
        }
    }

    manualSortRecords() {
        const aiTable = this.aiTable;
        const activeView = this.viewService.activeView();
        if (!activeView) return;
        const records = this.records();
        const recordsIndexMap = new Map(records?.map((item, index) => [item._id, index]));
        const sorts = activeView.settings?.sorts!;
        const newSortedRecords = sortRecordsByConditions(
            aiTable,
            buildRecordsWithWillMoveRecords(records, aiTable.recordsWillMove()),
            activeView,
            sorts
        );

        // Look：update positions of records
        const actions: AITableAction[] = [];
        newSortedRecords.forEach((record, index) => {
            const action = buildSetRecordPositionsAction(aiTable, { [activeView._id]: index }, [recordsIndexMap.get(record._id)!]);
            actions.push(action);
        });
        aiTable.apply(actions);
    }

    dragMoveRecords(options: MoveRecordOptions) {
        // Look：move records by manual drag
        moveRecords(this.aiTable, options);
    }
}
