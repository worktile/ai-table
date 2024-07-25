import { AITable, AITableAction, FLUSHING } from '@ai-table/grid';
import { CustomActions } from '../action';
import { AIViewAction, AIViewTable } from '../types/view';

export const withCustomApply = (aiTable: AITable) => {
    const viewTable = aiTable as AIViewTable;
    viewTable.viewApply = (action: AIViewAction) => {
        aiTable.actions.push(action as unknown as AITableAction);
        CustomActions.applyView(aiTable, action);
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
