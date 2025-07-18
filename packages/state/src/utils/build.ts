import { getSortRecords } from './record/sort';
import { getFilteredRecords } from './record/filter';
import { getSortFields } from './field/sort-fields';
import { AITableFieldType, AITableView, AITableViewFields, AITableViewRecords } from '@ai-table/utils';
import { AIViewTable } from '../types';
import { buildFieldStatType } from './field/stat-field';

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
    buildFieldStatType(sortFields, activeView);
    return sortFields;
}
