import { getSortRecords } from './record/sort';
import { getFilteredRecords } from './record/filter';
import { getSortFields } from './field/sort-fields';
import { AITableFieldType, AITableView, AITableViewFields, AITableViewRecords } from '@ai-table/utils';
import { AIViewTable } from '../types';
import { buildFieldStatType } from './field/stat-field';
import { GroupCalculator } from './group';

export function buildRecordsByView(
    aiTable: AIViewTable,
    records: AITableViewRecords,
    fields: AITableViewFields,
    activeView: AITableView,
    sortKeysMap?: Partial<Record<AITableFieldType, string>>
) {
    const filteredRecords = getFilteredRecords(aiTable, records, fields, activeView);
    return getSortRecords(aiTable, filteredRecords, activeView, sortKeysMap);
}

export function buildFieldsByView(aiTable: AIViewTable, fields: AITableViewFields, activeView: AITableView) {
    const sortFields = getSortFields(aiTable, fields as AITableViewFields, activeView);
    return buildFieldStatType(sortFields, activeView);
}

export function buildGroupLinearRows(
    aiTable: AIViewTable,
    records: AITableViewRecords,
    fields: AITableViewFields,
    activeView: AITableView
) {
    if (activeView?.settings?.groups?.length && fields && aiTable) {
        try {
            const groupInfo = activeView.settings?.groups!;
            const collapseState = activeView.settings?.groupCollapse;

            const calculator = new GroupCalculator(groupInfo, aiTable, collapseState);
            const linearRows = calculator.calculateLinearRows(records, fields);
            console.log('buildGroupLinearRows=', linearRows);
            return linearRows;
        } catch (error) {
            console.warn('Grouped build failed, using the default build method:', error);
        }
    }
    return null;
}
