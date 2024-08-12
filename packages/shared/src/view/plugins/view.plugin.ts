import { Actions, AITable, AITableAction, FLUSHING } from '@ai-table/grid';
import { ViewActions } from '../action';
import { AITableSharedAction, AITableViewAction, SharedAITable, ViewActionName } from '../../types';

export const withView = (aiTable: AITable) => {
    const viewTable = aiTable as SharedAITable;
    viewTable.apply = (action: AITableSharedAction) => {
        (aiTable.actions as AITableSharedAction[]).push(action);
        if ([ViewActionName.setView].includes(action.type as ViewActionName)) {
            ViewActions.transform(viewTable, action as AITableViewAction);
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
