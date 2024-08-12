import { Actions, AITable, AITableAction, FLUSHING } from '@ai-table/grid';
import { CustomActions } from '../action';
import { AITableSharedAction, AITableViewAction, SharedAITable, ViewActionName } from '@ai-table/shared';

export const withCustomApply = (aiTable: AITable) => {
    const viewTable = aiTable as SharedAITable;
    viewTable.apply = (action: AITableSharedAction) => {
        (aiTable.actions as AITableSharedAction[]).push(action);
        if ( [ViewActionName.setView].includes(action.type as ViewActionName)) {
            CustomActions.transform(viewTable, action as AITableViewAction);
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
