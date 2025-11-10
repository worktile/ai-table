import {
    AITableRecordHeightType,
    AITableView,
    ActionName,
    AddViewAction,
    RemoveViewAction,
    SetViewAction,
    ViewSettings
} from '@ai-table/utils';
import { AIViewTable } from '../types/ai-table';
import { getMaxPosition, insertAtEnd, insertBetween, sortViews } from '../utils';
import { PositionsActions } from './position';

export function buildSetViewAction(aiTable: AIViewTable, value: Partial<AITableView>, path: [string]) {
    const view = aiTable.views().find((item) => item._id === path[0]);
    if (view) {
        const properties: Partial<AITableView> = {};
        const newProperties: Partial<AITableView> = {};
        for (const key in value) {
            const k = key as keyof AITableView;
            if (JSON.stringify(view[k]) !== JSON.stringify(value[k])) {
                if (view.hasOwnProperty(k)) {
                    properties[k] = view[k] as any;
                }
                if (newProperties[k] !== null) {
                    newProperties[k] = value[k] as any;
                }
            }
        }

        const operation: SetViewAction = {
            type: ActionName.SetView,
            properties,
            newProperties,
            path
        };
        return operation;
    }
    return null;
}

function setView(aiTable: AIViewTable, value: Partial<AITableView>, path: [string]) {
    const action = buildSetViewAction(aiTable, value, path);
    if (action) {
        aiTable.apply(action);
    }
}

function addView(aiTable: AIViewTable, originId: string, newView: AITableView, isDuplicate?: boolean) {
    const views = sortViews(aiTable.views());
    const currentIndex = views.findIndex((item) => item._id === originId);
    if (isDuplicate) {
        const prev = currentIndex >= 0 ? (views[currentIndex].position ?? currentIndex) : null;
        const next = currentIndex + 1 < views.length ? (views[currentIndex + 1].position ?? currentIndex + 1) : null;

        let newPos: number;
        if (prev !== null && next === null) {
            // 复制最后一个插入最后位置
            newPos = insertAtEnd(prev, 1)[0];
        } else if (prev !== null && next !== null) {
            // 插入中间
            const result = insertBetween(prev, next, 1);
            if (result.positions.length) {
                newPos = result.positions[0];
            } else {
                PositionsActions.resetAllViewsPositions(aiTable);
                const reSort = sortViews(aiTable.views());
                const idx = reSort.findIndex((item) => item._id === originId);
                const prev2 = idx >= 0 ? (reSort[idx].position ?? idx) : 0;
                const next2 = idx + 1 < reSort.length ? (reSort[idx + 1].position ?? idx + 1) : null;
                newPos = next2 === null ? insertAtEnd(prev2, 1)[0] : insertBetween(prev2, next2, 1).positions[0];
            }
        } else {
            const maxPosition = getMaxPosition(views);
            newPos = insertAtEnd(maxPosition, 1)[0];
        }

        newView.position = newPos;
    } else {
        const maxPosition = getMaxPosition(views);
        newView.position = insertAtEnd(maxPosition, 1)[0];
    }
    const operation: AddViewAction = {
        type: ActionName.AddView,
        view: newView,
        isDuplicate
    };
    aiTable.apply(operation);
}

function removeView(aiTable: AIViewTable, path: [string]) {
    const operation: RemoveViewAction = {
        type: ActionName.RemoveView,
        path
    };
    aiTable.apply(operation);
}

function setRecordHeightType(aiTable: AIViewTable, recordHeightType: AITableRecordHeightType) {
    const viewId = aiTable.activeViewId();
    const view = aiTable.views().find((v) => v._id === viewId);
    if (!view) return;

    const currentSettings = view.settings || {};
    const newSettings: ViewSettings = {
        ...currentSettings,
        record_height_type: recordHeightType
    };

    const operation: SetViewAction = {
        type: ActionName.SetView,
        properties: { settings: currentSettings },
        newProperties: { settings: newSettings },
        path: [viewId]
    };
    aiTable.apply(operation);
}

export const ViewActions = {
    setView,
    addView,
    removeView,
    setRecordHeightType
};
