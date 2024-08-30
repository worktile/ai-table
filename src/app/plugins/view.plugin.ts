import { AITable } from '@ai-table/grid';
import { AITableSharedAction, AIViewTable, RemoveViewAction, VIEW_ACTIONS, ViewActionName } from '@ai-table/state';
import { TABLE_SERVICE_MAP } from '../service/table.service';

export const withRemoveView = (aiTable: AITable) => {
    const viewTable = aiTable as AIViewTable;
    const { apply } = viewTable;
    viewTable.apply = (action: AITableSharedAction) => {
        if (VIEW_ACTIONS.includes(action.type as ViewActionName)) {
            if (action.type === ViewActionName.RemoveView) {
                const tableService = TABLE_SERVICE_MAP.get(viewTable);
                const activeId = getActiveViewId(viewTable, action);
                activeId && tableService?.setActiveView(activeId);
            }
        }
        apply(action);
    };
    return aiTable;
};

export function getActiveViewId(aiTable: AIViewTable, action: AITableSharedAction) {
    const activeViewIndex = aiTable.views().findIndex((item) => item._id === (action as RemoveViewAction).path[0]);
    if (activeViewIndex > -1) {
        if (activeViewIndex === 0) {
            return aiTable.views()[1]._id;
        } else {
            return aiTable.views()[activeViewIndex - 1]._id;
        }
    }
    return null;
}
