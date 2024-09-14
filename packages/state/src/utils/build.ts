import { AITableView, AITableViewFields, AITableViewRecords } from '../types';
import { getFilteredRecords } from './filter-records';
import { AITable } from '@ai-table/grid';
import { getSortRecords, sortByViewPosition } from './sort-records';


export function buildRecordsByView(aiTable: AITable, records: AITableViewRecords, fields: AITableViewFields, activeView: AITableView) {
    const filteredRecords = getFilteredRecords(records, fields, activeView);
    return getSortRecords(aiTable, filteredRecords, activeView);
}

export function buildFieldsByView(fields: AITableViewFields, activeView: AITableView) {
    return sortByViewPosition(fields as AITableViewFields, activeView);
}
