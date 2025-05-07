import { AITableView } from '@ai-table/utils';
import { ActionName, AddViewAction, RemoveViewAction, SetViewAction } from '@ai-table/utils';
import { AIViewTable } from '../types/ai-table';

function setView(aiTable: AIViewTable, value: Partial<AITableView>, path: [string]) {
    const view = aiTable.views().find((item) => item._id === path[0]);
    if (view) {
        const properties: Partial<AITableView> = {};
        const newProperties: Partial<AITableView> = {};
        for (const key in value) {
            const k = key as keyof AITableView;
            if (JSON.stringify(view[k]) !== JSON.stringify(value[k])) {
                if (view.hasOwnProperty(k)) {
                    properties[k] = view[k] as any;
                }
                if (newProperties[k] !== null) {
                    newProperties[k] = value[k] as any;
                }
            }
        }

        const operation: SetViewAction = {
            type: ActionName.SetView,
            properties,
            newProperties,
            path
        };
        aiTable.apply(operation);
    }
}

function addView(aiTable: AIViewTable, originId: string, newView: AITableView, isDuplicate?: boolean) {
    const views = aiTable.views();
    const currentIndex = views.findIndex((item) => item._id === originId);
    if (isDuplicate) {
        const nextIndex = currentIndex + 1;
        newView.position = ((views[currentIndex]?.position ?? currentIndex) + (views[nextIndex]?.position ?? nextIndex)) / 2;
    } else {
        newView.position = currentIndex + 1;
    }
    const operation: AddViewAction = {
        type: ActionName.AddView,
        view: newView,
        isDuplicate
    };
    aiTable.apply(operation);
}

function removeView(aiTable: AIViewTable, path: [string]) {
    const operation: RemoveViewAction = {
        type: ActionName.RemoveView,
        path
    };
    aiTable.apply(operation);
}

export const ViewActions = {
    setView,
    addView,
    removeView
};
