import { ActionName, Actions, AITable, AITableAction, FLUSHING } from '@ai-table/grid';
import { GeneralActions, GeneralPositionActions, GeneralViewActions } from '../action';
import {
    AITablePositionAction,
    AITableSharedAction,
    AITableViewAction,
    AIViewTable,
    PositionActionName,
    ViewActionName
} from '../../types';
import { POSITION_ACTIONS, VIEW_ACTIONS } from '../constants/view';

export const withView = (aiTable: AITable) => {
    const viewTable = aiTable as AIViewTable;
    viewTable.apply = (action: AITableSharedAction) => {
        const sharedActions = viewTable.actions as AITableSharedAction[];
        sharedActions.push(action);
        if (VIEW_ACTIONS.includes(action.type as ViewActionName)) {
            GeneralViewActions.transform(viewTable, action as AITableViewAction);
        } else if (POSITION_ACTIONS.includes(action.type as PositionActionName)) {
            GeneralPositionActions.transform(viewTable, action as AITablePositionAction);
        } else {
            if (action.type === ActionName.AddField || action.type === ActionName.AddRecord) {
                GeneralActions.transform(viewTable, action);
            } else {
                Actions.transform(aiTable, action as AITableAction);
            }
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
