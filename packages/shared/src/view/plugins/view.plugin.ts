import { Actions, AITable, AITableAction, FLUSHING } from '@ai-table/grid';
import { AITableSharedAction, AITableViewAction, AIViewTable, ViewActionName } from '../../types';
import { GeneralActions } from '../action/general';
import { createDraft, finishDraft } from 'immer';

const VIEW_ACTIONS = [ViewActionName.SetView, ViewActionName.AddView, ViewActionName.RemoveView];

export const withView = (aiTable: AITable) => {
    const viewTable = aiTable as AIViewTable;
    viewTable.apply = (action: AITableSharedAction) => {
        (aiTable.actions as AITableSharedAction[]).push(action);
        if (VIEW_ACTIONS.includes(action.type as ViewActionName)) {
            if (action.type === ViewActionName.RemoveView) {
                setActiveView(viewTable, action);
            }
            GeneralActions.transform(viewTable, action as AITableViewAction);
        } else {
            Actions.transform(aiTable, action as AITableAction);
        }

        if (!FLUSHING.get(aiTable)) {
            FLUSHING.set(aiTable, true);
            Promise.resolve().then(() => {
                FLUSHING.set(aiTable, false);
                aiTable.onChange();
                aiTable.actions = [];
            });
        }
    };
    return aiTable;
};

export function setActiveView(aiTable: AIViewTable, action: AITableSharedAction) {
    const activeViewIndex = aiTable.views().findIndex((item) => item._id === action.path[0]);
    if (activeViewIndex > -1) {
        aiTable.views.update((value) => {
            const draftViews = createDraft(value);
            if (activeViewIndex === 0) {
                draftViews[1].is_active = true;
            } else {
                draftViews[activeViewIndex - 1].is_active = true;
            }
            return finishDraft(draftViews);
        });
    }
}
