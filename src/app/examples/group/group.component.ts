import {
    AITableField,
    AITableReferences,
    AITable,
    AITableRecord,
    AITableViewRecord,
    AITableSort,
    AITableGroupField,
    ViewSettings
} from '@ai-table/utils';
import { Component, computed, inject, Signal, signal, ChangeDetectionStrategy } from '@angular/core';
import { mockFields, mockRecords, mockReferences, mockViews } from './mock';
import { AIViewTable, withState, Actions, buildLinearRows } from '@ai-table/state';
import { CombinationSortExample } from '../common';
import { AITableGrid, AITableLinearRow } from '@ai-table/grid';
import { ViewService } from '../view/views';
import { helpers } from 'ngx-tethys/util';
import * as _ from 'lodash';

@Component({
    selector: 'app-table-group-example',
    templateUrl: './group.component.html',
    imports: [AITableGrid, CombinationSortExample],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ViewService]
})
export class TableGroupExample {
    aiTable!: AIViewTable;

    fields = signal<AITableField[]>(mockFields);

    records = signal<AITableRecord[]>(mockRecords);

    references = signal<AITableReferences>(mockReferences);

    plugins = [withState];

    private viewService = inject(ViewService);

    readonly groups = computed<AITableSort[]>(() => {
        return (this.viewService.activeView()?.settings?.groups || []).map((group: AITableGroupField) => ({
            sort_by: group.field_id,
            direction: group.direction
        }));
    });

    readonly buildGroupLinearRowsFn: Signal<() => AITableLinearRow[] | null> = computed(() => {
        return () => {
            const activeView = this.viewService.activeView();
            const hasGroups = activeView?.settings?.groups?.length;
            if (hasGroups) {
                return buildLinearRows(this.aiTable, activeView, this.records() as AITableViewRecord[]);
            }
            return null;
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

    groupsChange(event: { sorts: AITableSort[] }) {
        const newGroups: AITableGroupField[] = event.sorts.map((sort) => {
            return {
                field_id: sort.sort_by,
                direction: sort.direction
            };
        });
        const settings = this.viewService.activeView().settings;
        const oldGroups = settings?.groups || [];

        if (!_.isEqual(newGroups, oldGroups)) {
            // update groups in view settings
            const newSettings: ViewSettings = {
                ...(this.viewService.activeView()?.settings || {}),
                groups: newGroups
            };

            // update collapsed_group_ids in view settings, should remove the deleted groups from collapsed_group_ids
            const collapsedGroupIds = settings?.collapsed_group_ids || [];
            const deletedGroups = _.differenceBy(oldGroups, newGroups, 'field_id');
            if (deletedGroups.length > 0) {
                const newCollapsedGroupIds = collapsedGroupIds.filter((id) => !deletedGroups.some((group) => id.includes(group.field_id)));
                newSettings.collapsed_group_ids = newCollapsedGroupIds;
            }

            Actions.setView(this.aiTable, { settings: newSettings }, [this.viewService.activeViewId()]);
        }
    }

    toggleGroupCollapse(groupId: string) {
        // update collapsed_group_ids in view settings
        Actions.toggleGroupCollapse(this.aiTable, groupId);
    }
}
