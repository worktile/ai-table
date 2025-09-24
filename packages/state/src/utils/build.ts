import { sortRecordsByConditions } from './record/sort';
import { getFilteredRecords } from './record/filter';
import { getSortFields } from './field/sort-fields';
import { AITableFieldType, AITableRecord, AITableView, AITableViewFields, AITableViewRecords } from '@ai-table/utils';
import { AIViewTable } from '../types';
import { buildFieldStatType } from './field/stat-field';
import { GroupCalculator } from './group';
import { unionBy, map } from 'lodash';
import { buildNormalLinearRows } from '@ai-table/grid';
import { buildRecordsWithWillMoveRecords } from './record';

export function buildRecordsByView(
    aiTable: AIViewTable,
    records: AITableViewRecords,
    fields: AITableViewFields,
    activeView: AITableView,
    sortKeysMap?: Partial<Record<AITableFieldType, string>>
) {
    const filteredRecords = getFilteredRecords(aiTable, records, fields, activeView);
    const sorts = buildSorts(activeView);
    const renderRecords = buildRecordsWithWillMoveRecords(filteredRecords, aiTable.recordsWillMove());
    return sortRecordsByConditions(aiTable, renderRecords, activeView, sorts);
}

export function buildFieldsByView(aiTable: AIViewTable, fields: AITableViewFields, activeView: AITableView) {
    const sortFields = getSortFields(aiTable, fields as AITableViewFields, activeView);
    return buildFieldStatType(sortFields, activeView);
}

export function buildLinearRows(aiTable: AIViewTable, activeView: AITableView, records: AITableViewRecords) {
    if (aiTable && activeView?.settings?.groups?.length) {
        try {
            const groups = activeView.settings?.groups!;
            let collapsedGroupIds: string[] = [];
            if (!aiTable.context!.groupCollapseDisabled()) {
                collapsedGroupIds = activeView.settings?.collapsed_group_ids || [];
            }

            const calculator = new GroupCalculator(aiTable, groups, collapsedGroupIds);
            return calculator.calculateLinearRows(records);
        } catch (error) {
            console.warn('Grouped build failed, using the default build method:', error);
            return null;
        }
    } else {
        return buildNormalLinearRows(records);
    }
}

export function buildSorts(activeView: AITableView) {
    const groups = activeView.settings?.groups || [];
    const isKeepSort = activeView.settings?.is_keep_sort;
    if (groups.length > 0 && !isKeepSort) {
        return groups.map((group) => ({
            sort_by: group.field_id,
            direction: group.direction
        }));
    } else if (isKeepSort) {
        return mergeSorts(activeView);
    }
    return [];
}

export function mergeSorts(activeView: AITableView) {
    const groups = activeView.settings?.groups || [];

    const sorts = activeView.settings?.sorts || [];
    const groupsAsSorts = map(groups, (group) => ({
        sort_by: group.field_id,
        direction: group.direction
    }));
    const mergedSorts = unionBy(groupsAsSorts, sorts, 'sort_by');
    return mergedSorts;
}
