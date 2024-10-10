import { AITable } from '@ai-table/grid';
import { TABLE_SERVICE_MAP } from '../service/table.service';
import { AIViewTable, AITableAction, VIEW_ACTIONS, ActionName, RemoveViewAction } from '@ai-table/state';

export const withRemoveView = (aiTable: AITable) => {
    const viewTable = aiTable as AIViewTable;
    const { apply } = viewTable;
    viewTable.apply = (action: AITableAction) => {
        if (VIEW_ACTIONS.includes(action.type as ActionName)) {
            if (action.type === ActionName.RemoveView) {
                const tableService = TABLE_SERVICE_MAP.get(viewTable);
                const activeId = getActiveViewId(viewTable, action);
                activeId && tableService?.setActiveView(activeId);
            }
        }
        apply(action);
    };
    return aiTable;
};

export function getActiveViewId(aiTable: AIViewTable, action: AITableAction) {
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
