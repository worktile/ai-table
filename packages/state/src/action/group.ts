import { ActionName, SetViewAction, AITableView, AITableGroupField, SortDirection } from '@ai-table/utils';
import { AIViewTable } from '../types/ai-table';
import { AI_TABLE_GROUP_MAX_LEVEL } from '@ai-table/grid';

function setViewGroup(aiTable: AIViewTable, groups: AITableGroupField[] | null) {
    const viewId = aiTable.activeViewId();
    const view = aiTable.views().find((v) => v._id === viewId);
    if (!view) return;

    const currentSettings = view.settings || {};
    const newSettings = {
        ...currentSettings,
        groups: groups || [],
        collapsed_group_ids: [] // 重置折叠
    };

    const operation: SetViewAction = {
        type: ActionName.SetView,
        properties: { settings: currentSettings },
        newProperties: { settings: newSettings },
        path: [viewId]
    };
    aiTable.apply(operation);
}

function setCollapsedGroup(aiTable: AIViewTable, collapsedGroupIds: string[]) {
    const viewId = aiTable.activeViewId();
    const view = aiTable.views().find((v) => v._id === viewId);
    if (!view) return;

    const currentSettings = view.settings || {};
    const newSettings = {
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

// 折叠
function toggleGroupCollapse(aiTable: AIViewTable, groupId: string) {
    const viewId = aiTable.activeViewId();
    const view = aiTable.views().find((v) => v._id === viewId);
    if (!view) return;

    const currentCollapse = view.settings?.collapsed_group_ids || [];
    const newCollapse = currentCollapse.includes(groupId) ? currentCollapse.filter((id) => id !== groupId) : [...currentCollapse, groupId];

    setCollapsedGroup(aiTable, newCollapse);
}

// 添加分组
function addGroupField(aiTable: AIViewTable, fieldId: string, direction: SortDirection = SortDirection.ascending) {
    const view = aiTable.views().find((v) => v._id === aiTable.activeViewId());
    if (!view) return;

    const currentGroups = view.settings?.groups || [];

    // 是否已存在
    if (currentGroups.some((group) => group.field_id === fieldId)) {
        throw new Error('The field has been used for grouping.');
    }

    // 层级限制
    if (currentGroups.length >= AI_TABLE_GROUP_MAX_LEVEL) {
        throw new Error(`The maximum number of groups is ${AI_TABLE_GROUP_MAX_LEVEL}.`);
    }

    const newGroups: AITableGroupField[] = [...currentGroups, { field_id: fieldId, direction }];
    setViewGroup(aiTable, newGroups);
}

// 删除分组
function removeGroupField(aiTable: AIViewTable, fieldId: string) {
    const view = aiTable.views().find((v) => v._id === aiTable.activeViewId());
    if (!view) return;

    const currentGroups = view.settings?.groups || [];
    const newGroups = currentGroups.filter((group) => group.field_id !== fieldId);

    setViewGroup(aiTable, newGroups.length > 0 ? newGroups : null);
}

// 更新排序方向
function updateGroupFieldDirection(aiTable: AIViewTable, fieldId: string, direction: SortDirection) {
    const view = aiTable.views().find((v) => v._id === aiTable.activeViewId());
    if (!view) return;

    const currentGroups = view.settings?.groups || [];
    const newGroups = currentGroups.map((group) => (group.field_id === fieldId ? { ...group, direction } : group));

    setViewGroup(aiTable, newGroups);
}

// 重新排序，拖拽顺序
function reorderGroupFields(aiTable: AIViewTable, fromIndex: number, toIndex: number) {
    const view = aiTable.views().find((v) => v._id === aiTable.activeViewId());
    if (!view) return;

    const currentGroups = view.settings?.groups || [];

    if (fromIndex < 0 || fromIndex >= currentGroups.length || toIndex < 0 || toIndex >= currentGroups.length) {
        return;
    }

    const newGroups = [...currentGroups];
    const [movedItem] = newGroups.splice(fromIndex, 1);
    newGroups.splice(toIndex, 0, movedItem);

    setViewGroup(aiTable, newGroups);
}

// 清空分组
function clearAllGroups(aiTable: AIViewTable) {
    setViewGroup(aiTable, null);
}

export const GroupActions = {
    setViewGroup,
    setCollapsedGroup,
    toggleGroupCollapse,
    addGroupField,
    removeGroupField,
    updateGroupFieldDirection,
    reorderGroupFields,
    clearAllGroups
};
