import { AITableView, AIViewAction, ViewActionName } from '../types/view';
import { AIViewTable } from '../types/view';
import { createDraft, finishDraft } from 'immer';

export function setView(aiTable: AIViewTable, newView: AITableView, path: [number]) {
    const [index] = path;
    const view = aiTable.views()[index];
    if (JSON.stringify(view) !== JSON.stringify(newView)) {
        const operation = {
            type: ViewActionName.setView,
            view,
            newView,
            path
        };
        aiTable.viewApply(operation);
    }
}

export const GeneralActions = {
    transform(aiTable: AIViewTable, op: AIViewAction): void {
        const views = createDraft(aiTable.views());
        applyView(aiTable, views, op);
        aiTable.views.update(() => {
            return finishDraft(views);
        });
    }
};

export const applyView = (aiTable: AIViewTable, views: AITableView[], options: AIViewAction) => {
    const [viewIndex] = options.path;
    views[viewIndex] = options.newView;
    return views;
};

export const ViewActions = {
    setView,
    applyView
};
