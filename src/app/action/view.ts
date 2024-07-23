import { AITableAction } from '@ai-table/grid';
import { AIViewTable } from '../types';
import { createDraft, finishDraft } from 'immer';

export type SetViewAction = {
    type: 'set_view';
    path: [number];
    view: any;
};

export function setView(aiTable: AIViewTable, view: any, path: [number]) {
    const operation: SetViewAction = {
        type: 'set_view',
        view: view,
        path
    };
    aiTable.applyView(operation);
}

export const ViewActions = {
    setView
};

const apply = (views: any, action: ViewTableAction) => {
    switch (action.type) {
        case 'set_view':
            let updateView = views[action.path[0]];
            views[action.path[0]] = {
                ...updateView,
                ...action.view
            };
    }
    return {
        views
    };
};

export const AIViewTableActions = {
    transform(aiTable: AIViewTable, action: ViewTableAction): void {
        const views = createDraft(aiTable.views());
        apply(views, action);
        aiTable.views.update(() => {
            return finishDraft(views);
        });
    }
};

export type ViewTableAction = SetViewAction | AITableAction;
