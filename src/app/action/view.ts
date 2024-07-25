import { AITable } from '@ai-table/grid';
import { AITableView, ViewActionName } from '../types/view';
import { AIViewTable } from '../types/view';

export function updateRowHeight(aiTable: AIViewTable, view: AITableView, key: string, value: any) {
    const operation = {
        type: ViewActionName.updateRowHeight,
        view: view,
        key: key,
        value: value
    };
    aiTable.viewApply(operation);
}

export const applyView = (aiTable: AITable, options: any) => {
    const view = options.view;
    const key = options.key;
    const value = options.value;
    view[key] = value;
};

export const ViewActions = {
    updateRowHeight,
    applyView
};
