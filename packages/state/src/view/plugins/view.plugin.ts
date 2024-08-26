import { ActionName, Actions, AITable, AITableAction, FLUSHING } from '@ai-table/grid';
import { GeneralViewActions } from '../action';
import { AITableSharedAction, AITableViewAction, AIViewTable, ViewActionName } from '../../types';
import { VIEW_ACTIONS } from '../constants/view';
import { YjsAITable } from '../../shared';

export const withView = (aiTable: AITable) => {
    const viewTable = aiTable as AIViewTable;
    viewTable.apply = (action: AITableSharedAction) => {
        const actions = aiTable.actions as AITableSharedAction[];
        actions.push(action);
        if (VIEW_ACTIONS.includes(action.type as ViewActionName)) {
            GeneralViewActions.transform(viewTable, action as AITableViewAction);
        } else {
            Actions.transform(aiTable, action as AITableAction);
            if (!YjsAITable.isRemote(viewTable)) {
                if (action.type === ActionName.AddRecord) {
                    actions.push({
                        type: ViewActionName.AddPosition,
                        key: 'recordPositions',
                        node: action.record._id,
                        path: action.path
                    });
                }
                if (action.type === ActionName.AddField) {
                    // 循环 records 添加 recordPosition
                    // 循环 fields 添加 fieldPosition
                }
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
