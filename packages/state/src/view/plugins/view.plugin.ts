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
            updateActionByView(viewTable, action);
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

function updateActionByView(aiTable: AIViewTable, action: AITableSharedAction) {
    const activeView = aiTable.views().find((item) => item._id === aiTable.activeViewId());
    if (action.type === ActionName.AddRecord) {
        if (activeView?.settings?.conditions) {
            action.path = [aiTable.records().length];
            // 参考 ApiTable 逻辑，当 filedId 只出现一次，并且 condition_logical 是 or 的情况下
            // 改变新增行对应列的默认值
            if (activeView?.settings?.conditions.length === 0 || activeView?.settings?.condition_logical === 'and') {
                const updateFieldIdsMap: { [key: string]: any } = {};
                activeView?.settings?.conditions.forEach((item) => {
                    if (!updateFieldIdsMap[item.field_id]) {
                        updateFieldIdsMap[item.field_id] = item.value;
                    } else {
                        delete updateFieldIdsMap[item.field_id];
                    }
                });
                for (const key in updateFieldIdsMap) {
                    action.record.values[key] = updateFieldIdsMap[key];
                }
            }
        }
    }
}
