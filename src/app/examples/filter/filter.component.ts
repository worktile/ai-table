import { Component, computed, inject, Signal, signal, ChangeDetectionStrategy } from '@angular/core';
import { AITable, AITableGrid } from '@ai-table/grid';
import { AIViewTable, buildRecordsByView, withState, Actions } from '@ai-table/state';
import {
    AITableField,
    AITableFilterCondition,
    AITableFilterConditions,
    AITableFilterLogical,
    AITableRecord,
    AITableReferences,
    AITableValue,
    AITableViewField,
    AITableViewRecord
} from '@ai-table/utils';
import { mockFields, mockRecords, mockReferences, mockViews } from './mock';
import { ConditionSelectorExample } from './condition-selector/condition-selector.component';
import { helpers } from 'ngx-tethys/util';
import { ViewService } from '../view/views';

@Component({
    selector: 'app-table-filter-example',
    templateUrl: './filter.component.html',
    standalone: true,
    imports: [ConditionSelectorExample, AITableGrid],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ViewService]
})
export class TableFilterExample {
    aiTable!: AIViewTable;

    fields = signal<AITableViewField[]>(mockFields);

    records = signal<AITableViewRecord[]>(mockRecords);

    references = signal<AITableReferences>(mockReferences);

    plugins = [withState];

    private viewService = inject(ViewService);

    readonly conditions = computed<AITableFilterCondition[]>(() => {
        return this.viewService.activeView()?.settings?.conditions || [];
    });

    readonly logic = computed<AITableFilterLogical>(() => {
        return this.viewService.activeView()?.settings?.condition_logical || AITableFilterLogical.and;
    });

    readonly buildRenderDataFn: Signal<() => AITableValue> = computed(() => {
        return () => {
            const renderRecords = buildRecordsByView(this.aiTable, this.records(), this.fields(), this.viewService.activeView());

            // Look：return filtered records
            return {
                records: renderRecords,
                fields: this.fields()
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

    conditionsChange(filterConditions: AITableFilterConditions) {
        const oldSettings = this.viewService.activeView()?.settings || {};
        const newSettings = {
            ...oldSettings,
            ...filterConditions
        };
        const activeViewId = this.viewService.activeViewId();

        // update condition_logical and conditions in view settings
        Actions.setView(
            this.aiTable,
            {
                settings: newSettings
            },
            [activeViewId]
        );
    }
}
