import { Actions, AITable, AITableAction, FLUSHING } from '@ai-table/grid';
import { GeneralViewActions } from '../action';
import { AITableSharedAction, AITableViewAction, AIViewTable, ViewActionName } from '../../types';
import { VIEW_ACTIONS } from '../constants/view';

export const withView = (aiTable: AITable) => {
    const viewTable = aiTable as AIViewTable;
    viewTable.apply = (action: AITableSharedAction) => {
        (aiTable.actions as AITableSharedAction[]).push(action);
        if (VIEW_ACTIONS.includes(action.type as ViewActionName)) {
            GeneralViewActions.transform(viewTable, action as AITableViewAction);
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
