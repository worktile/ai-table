import { createDraft, finishDraft } from 'immer';
import { AITableView, AITableViewAction, AIViewTable, ViewActionName } from '../../types';

export const GeneralActions = {
    transform(aiTable: AIViewTable, action: AITableViewAction): void {
        const views = createDraft(aiTable.views());
        applyView(aiTable, views, action);
        aiTable.views.update(() => {
            return finishDraft(views);
        });
    }
};

export const applyView = (aiTable: AIViewTable, views: AITableView[], options: AITableViewAction) => {
    switch (options.type) {
        case ViewActionName.SetView: {
            const view = views.find((item) => item._id === options.path[0]) as AITableView;
            if (view) {
                for (const key in options.newProperties) {
                    const k = key as keyof AITableView;
                    const value = options.newProperties[k];
                    if (value == null) {
                        delete view[k];
                    } else {
                        (view[k] as any) = value;
                    }
                }

                // properties that were previously defined, but are now missing, must be deleted
                for (const key in options.properties) {
                    if (!options.newProperties.hasOwnProperty(key)) {
                        delete view[<keyof AITableView>key];
                    }
                }
            }
        }
    }
};
