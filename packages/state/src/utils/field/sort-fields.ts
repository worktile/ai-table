import { AITable } from '@ai-table/grid';
import { sortByViewPosition } from '../common';
import { AITableView, AITableViewFields } from '@ai-table/utils';

export function getSortFields(aiTable: AITable, fields: AITableViewFields, activeView: AITableView) {
    return sortByViewPosition(fields as AITableViewFields, activeView) as AITableViewFields;
}
