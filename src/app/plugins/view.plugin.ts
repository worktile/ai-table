import { AITable } from '@ai-table/grid';
import { TABLE_SERVICE_MAP } from '../service/table.service';
import { AIViewTable } from '@ai-table/state';
import { ActionName, AITableAction, RemoveViewAction } from '@ai-table/utils';

export const withRemoveView = (aiTable: AITable) => {
    const viewTable = aiTable as AIViewTable;
    const { apply } = viewTable;
    viewTable.apply = (action: AITableAction | AITableAction[]) => {
        const actions = Array.isArray(action) ? action : [action];
        const hasRemoveView = actions.some((item) => item.type === ActionName.RemoveView);
        if (hasRemoveView) {
            const removeAction = actions.find((item) => item.type === ActionName.RemoveView) as RemoveViewAction;
            const tableService = TABLE_SERVICE_MAP.get(viewTable);
            const activeId = getActiveViewId(viewTable, removeAction);
            activeId && tableService?.setActiveView(activeId);
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
