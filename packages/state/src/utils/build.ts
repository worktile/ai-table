import { AITableView, AITableViewFields, AITableViewRecords, AIViewTable } from '../types';
import { getSortRecords } from './record/sort';
import { getFilteredRecords } from './record/filter';
import { getSortFields } from './field/sort-fields';

export function buildRecordsByView(aiTable: AIViewTable, records: AITableViewRecords, fields: AITableViewFields, activeView: AITableView) {
    const filteredRecords = getFilteredRecords(aiTable, records, fields, activeView);
    return getSortRecords(aiTable, filteredRecords, activeView);
}

export function buildFieldsByView(aiTable: AIViewTable, fields: AITableViewFields, activeView: AITableView) {
    return getSortFields(aiTable, fields as AITableViewFields, activeView);
}
