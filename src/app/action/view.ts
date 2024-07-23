import { AITable, AITableRecords, AITableFields } from '@ai-table/grid';
import { AITableView, CustomActionName } from '../types/views';

export function updateRowHeight(aiTable: AITable, views: AITableView, key: string, value: any) {
    const operation = {
        type: CustomActionName.updateRowHeight,
        views: views,
        key: key,
        value: value
    };
    aiTable.apply(operation as any);
}

export const updateRowHeightFn = (aiTable: AITable, records: AITableRecords, fields: AITableFields, options: any) => {
    const views = options.views;
    const key = options.key;
    const value = options.value;
    views[key] = value;
};

export const ViewActions = {
    updateRowHeight,
    updateRowHeightFn
};
