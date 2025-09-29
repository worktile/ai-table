import { AITableRecord, AITableViewField, AITableViewFields, AITableViewRecord, AITableViewRecords, Positions } from '@ai-table/utils';
import { AIViewTable } from '../types/ai-table';
import { insertAtEnd, insertAtStart, insertBetween } from './position';
import { getMaxPosition } from './view';

export type ViewPositionOptions = { afterItemId?: string; beforeItemId?: string; count?: number };

export function findNextItemByPosition<T extends AITableViewRecord | AITableViewField>(
    aiTable: AIViewTable,
    targetId: string,
    items: T[],
    itemsMap: { [key: string]: T extends AITableViewRecord ? AITableRecord : AITableViewField }
): T | null {
    const viewId = aiTable.activeViewId();
    const targetItem = itemsMap[targetId] as T;
    const targetPosition = targetItem.positions[viewId] || 0;
    let nextItem: T | null = null;
    for (const item of items) {
        const pos = item.positions[viewId] || 0;
        if (pos > targetPosition && (nextItem === null || pos < nextItem.positions[viewId])) {
            nextItem = item;
        }
    }
    return nextItem;
}

export function findPrevItemByPosition<T extends AITableViewRecord | AITableViewField>(
    aiTable: AIViewTable,
    targetId: string,
    items: T[],
    itemsMap: { [key: string]: T extends AITableViewRecord ? AITableRecord : AITableViewField }
): T | null {
    const viewId = aiTable.activeViewId();
    const targetItem = itemsMap[targetId] as T;
    const targetPosition = targetItem.positions[viewId] || 0;
    let prevItem: T | null = null;
    for (const item of items) {
        const pos = item.positions[viewId] || 0;
        if (pos < targetPosition && (prevItem === null || pos > prevItem.positions[viewId])) {
            prevItem = item;
        }
    }
    return prevItem;
}

export function getPreviousAndNextPosition<T extends AITableViewRecord | AITableViewField>(
    aiTable: AIViewTable,
    options: { afterItemId?: string; beforeItemId?: string },
    items: T[],
    itemsMap: { [key: string]: T extends AITableViewRecord ? AITableRecord : AITableViewField }
): { nextPosition: number | null; previousPosition: number | null } {
    const activeViewId = aiTable.activeViewId();
    const { afterItemId, beforeItemId } = options;
    let nextPosition = null;
    let previousPosition = null;

    if (afterItemId) {
        // 移动到指定项之后
        const previousItem = itemsMap[afterItemId] as T;
        if (!previousItem) {
            throw new Error(`Target item with id ${afterItemId} not found`);
        }

        previousPosition = previousItem.positions[activeViewId] || 0;
        const nextItem = findNextItemByPosition<T>(aiTable, afterItemId, items, itemsMap);
        if (nextItem !== null) {
            nextPosition = nextItem.positions[activeViewId] || 0;
        }
    } else if (beforeItemId) {
        // 移动到指定项之前
        const nextItem = itemsMap[beforeItemId] as T;
        if (!nextItem) {
            throw new Error(`Target item with id ${beforeItemId} not found`);
        }

        nextPosition = nextItem.positions[activeViewId] || 0;
        const previousItem = findPrevItemByPosition<T>(aiTable, beforeItemId, items, itemsMap);
        if (previousItem !== null) {
            previousPosition = previousItem.positions[activeViewId] || 0;
        }
    } else {
        throw new Error('Either afterItemId or beforeItemId must be provided');
    }
    return {
        nextPosition,
        previousPosition
    };
}

export function getCurrentViewPositions<T extends AITableViewRecord | AITableViewField>(
    aiTable: AIViewTable,
    options: ViewPositionOptions,
    items: T[],
    itemsMap: { [key: string]: T extends AITableViewRecord ? AITableRecord : AITableViewField }
) {
    const { previousPosition, nextPosition } = getPreviousAndNextPosition(aiTable, options, items, itemsMap);
    const count = options.count || 1;
    let positions = [];
    if (options.beforeItemId && previousPosition === null && nextPosition !== null) {
        positions = insertAtStart(nextPosition, count).map((item) => item.position);
    } else if (options.afterItemId && nextPosition === null && previousPosition !== null) {
        positions = insertAtEnd(previousPosition, count).map((item) => item.position);
    } else {
        const result = insertBetween(previousPosition!, nextPosition!, count);
        positions = result.positions;
        if (result.reason) {
            console.log(result.reason);
        }
    }
    return positions;
}

export function getNewItemsPosition<T extends AITableViewRecord | AITableViewField>(
    aiTable: AIViewTable,
    options: ViewPositionOptions,
    items: T[],
    itemsMap: { [key: string]: T extends AITableViewRecord ? AITableRecord : AITableViewField }
) {
    if (!options.afterItemId && !options.beforeItemId && items.length > 0) {
        options.afterItemId = items[items.length - 1]._id;
    }
    let positions = getCurrentViewPositions(aiTable, options, items, itemsMap);
    if (positions.length === 0) {
        return [];
    }
    const views = aiTable.views();
    const activeViewId = aiTable.activeViewId();
    const viewsMaxPosition: Record<string, number> = {};
    views.forEach((view) => {
        viewsMaxPosition[view._id] = getMaxPosition(items as AITableViewRecords | AITableViewFields, view._id);
    });
    const viewPositions = positions.map((itemPosition) => {
        const viewPositions: Positions = {};
        views.forEach((view) => {
            if (view._id === activeViewId) {
                viewPositions[view._id] = itemPosition;
            } else {
                const maxPosition = viewsMaxPosition[view._id];
                const newMaxPosition = insertAtEnd(maxPosition, 1);
                viewsMaxPosition[view._id] += newMaxPosition[0].position;
                viewPositions[view._id] = viewsMaxPosition[view._id];
            }
        });
        return viewPositions;
    });
    return viewPositions;
}
