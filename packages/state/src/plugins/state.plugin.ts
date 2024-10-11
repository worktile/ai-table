import { AITable } from '@ai-table/grid';
import { AITableAction, AIViewTable } from '../types';
import { Actions } from '../action';
import { FLUSHING } from '../utils';

export const withState = (aiTable: AITable) => {
    const viewTable = aiTable as AIViewTable;
    viewTable.actions = [];

    viewTable.apply = (action: AITableAction) => {
        viewTable.actions.push(action);
        Actions.transform(viewTable, action as AITableAction);

        if (!FLUSHING.get(viewTable)) {
            FLUSHING.set(viewTable, true);
            Promise.resolve().then(() => {
                FLUSHING.set(viewTable, false);
                viewTable.onChange();
                viewTable.actions = [];
            });
        }
    };
    return aiTable;
};
