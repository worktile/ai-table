import { ActionName, SetViewAction, ViewSettings } from '@ai-table/utils';
import { AIViewTable } from '../types/ai-table';

function setCollapsedGroup(aiTable: AIViewTable, collapsedGroupIds: string[]) {
    const viewId = aiTable.activeViewId();
    const view = aiTable.views().find((v) => v._id === viewId);
    if (!view) return;

    const currentSettings = view.settings || {};
    const newSettings: ViewSettings = {
        ...currentSettings,
        collapsed_group_ids: collapsedGroupIds
    };

    const operation: SetViewAction = {
        type: ActionName.SetView,
        properties: { settings: currentSettings },
        newProperties: { settings: newSettings },
        path: [viewId]
    };
    aiTable.apply(operation);
}

function toggleGroupCollapse(aiTable: AIViewTable, groupId: string) {
    const activeView = aiTable.viewsMap()[aiTable.activeViewId()];
    if (!activeView) return;
    const currentCollapse = activeView.settings?.collapsed_group_ids || [];
    const newCollapse = currentCollapse.includes(groupId) ? currentCollapse.filter((id) => id !== groupId) : [...currentCollapse, groupId];

    setCollapsedGroup(aiTable, newCollapse);
}

export const GroupActions = {
    toggleGroupCollapse
};
