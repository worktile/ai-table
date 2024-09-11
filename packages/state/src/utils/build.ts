import { AITableView, AITableViewFields, AITableViewRecords } from '../types';
import { getFilteredRecords } from './filter-records';

export function sortByView(data: AITableViewRecords | AITableViewFields, activeViewId: string) {
    const hasPositions = data.every((item) => item.positions && item.positions);
    if (hasPositions) {
        return [...data].sort((a, b) => a.positions[activeViewId] - b.positions[activeViewId]);
    }
    return data;
}

export function buildRecordsByView(records: AITableViewRecords, fields: AITableViewFields, activeView: AITableView) {
    const filteredRecords = getFilteredRecords(records, fields, activeView);
    return sortByView(filteredRecords, activeView._id);
}

export function buildFieldsByView(fields: AITableViewFields, activeView: AITableView) {
    return sortByView(fields as AITableViewFields, activeView._id);
}
