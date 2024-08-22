import { createDraft, finishDraft } from 'immer';
import { AITableView, AITableViewAction, AIViewTable, ViewActionName } from '../../types';

export const GeneralViewActions = {
    transform(aiTable: AIViewTable, action: AITableViewAction): void {
        const views = createDraft(aiTable.views());
        applyView(aiTable, views, action);
        aiTable.views.update(() => {
            return finishDraft(views);
        });
    }
};

export const applyView = (aiTable: AIViewTable, views: AITableView[], action: AITableViewAction) => {
    switch (action.type) {
        case ViewActionName.SetView: {
            const view = views.find((item) => item._id === action.path[0]) as AITableView;
            if (view) {
                for (const key in action.newProperties) {
                    const k = key as keyof AITableView;
                    const value = action.newProperties[k];
                    if (value == null) {
                        delete view[k];
                    } else {
                        (view[k] as any) = value;
                    }
                }

                // properties that were previously defined, but are now missing, must be deleted
                for (const key in action.properties) {
                    if (!action.newProperties.hasOwnProperty(key)) {
                        delete view[<keyof AITableView>key];
                    }
                }
            }
            break;
        }
        case ViewActionName.AddView: {
            const [viewIndex] = action.path;
            if (viewIndex > -1) {
                views.splice(viewIndex, 0, action.view);
            }
            break;
        }
        case ViewActionName.RemoveView: {
            const [viewId] = action.path;
            const viewIndex = views.findIndex((item) => item._id === viewId);
            if (viewIndex > -1) {
                views.splice(viewIndex, 1);
            }
            break;
        }
    }
};
