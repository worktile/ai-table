import { ActionName, Actions, AITable, AITableAction, FLUSHING } from '@ai-table/grid';
import { WritableSignal } from '@angular/core';
import { AIViewTableActions, ViewTableAction } from '../action/view';
import { AIViewTable } from '../types';

export function withView(aiTable: AITable, views: WritableSignal<any>): AIViewTable {
    const viewAITable = aiTable;

    (viewAITable as AIViewTable).views = views;

    (viewAITable as AIViewTable).applyView = (action: ViewTableAction) => {
        aiTable.actions.push(action as AITableAction);
        AIViewTableActions.transform(viewAITable as AIViewTable, action);
        if (!FLUSHING.get(aiTable)) {
            FLUSHING.set(aiTable, true);
            Promise.resolve().then(() => {
                FLUSHING.set(aiTable, false);
                aiTable.onChange();
                aiTable.actions = [];
            });
        }
    };

    return viewAITable as AIViewTable;
}
