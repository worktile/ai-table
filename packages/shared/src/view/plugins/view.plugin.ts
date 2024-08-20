import { Actions, AITable, AITableAction, FLUSHING } from '@ai-table/grid';
import { AITableSharedAction, AITableViewAction, AIViewTable, ViewActionName } from '../../types';
import { GeneralActions } from '../action/general';

const VIEW_ACTIONS = [ViewActionName.SetView, ViewActionName.AddView, ViewActionName.RemoveView];

export const withView = (aiTable: AITable) => {
    const viewTable = aiTable as AIViewTable;
    viewTable.apply = (action: AITableSharedAction) => {
        (aiTable.actions as AITableSharedAction[]).push(action);
        if (VIEW_ACTIONS.includes(action.type as ViewActionName)) {
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
