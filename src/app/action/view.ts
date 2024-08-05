import { AITableView, AIViewAction, ViewActionName } from '../types/view';
import { AIViewTable } from '../types/view';
import { createDraft, finishDraft } from 'immer';

export function setView(aiTable: AIViewTable, value: Partial<AITableView>, path: [number]) {
    const [index] = path;
    const view: AITableView = aiTable.views()[index];
    const oldView: Partial<AITableView> = {};
    const newView: Partial<AITableView> = {};
    for (const key in value) {
        const k = key as keyof AITableView;
        if (JSON.stringify(view[k]) !== JSON.stringify(value[k])) {
            if (view.hasOwnProperty(key)) {
                oldView[k] = view[k] as any;
            }
            newView[k] = value[k] as any;
        }
    }
    const operation = {
        type: ViewActionName.setView,
        view: oldView,
        newView,
        path
    };
    aiTable.viewApply(operation);

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
    const targetView: AITableView = views[viewIndex] 
    Object.entries(options.newView).forEach(([k, value]) => {
        const key = k  as keyof AITableView;
        if (value == null) {
            delete targetView[key]
        } else {
            targetView[key] = value as never  
        }
    });
    Object.entries(options.view).forEach(([k, value]) => {
        if (!options.newView.hasOwnProperty(k)) {
            const key = k  as keyof AITableView;
            delete targetView[key]
        }
    });
    return views;
};

export const ViewActions = {
    setView,
    applyView
};
