import { shortIdCreator } from '@ai-table/grid';
import { AITableAction, AITableView, idCreator, AITableViewFields, AITableViewRecords, Positions } from '@ai-table/utils';
import { ViewActions } from '../action/view';
import { buildSetRecordPositionsAction } from '../action/position';
import { generateCopyName } from './common';
import { generateNewName } from '@ai-table/grid';
import { AITableStateI18nKey, getStateI18nTextByKey } from './i18n';
import { AIViewTable } from '../types';
import _ from 'lodash';
import { buildSetFieldAction } from '../action/field';

export function createPositions(views: AITableView[], activeId: string, data: AITableViewRecords | AITableViewFields, index?: number) {
    return createMultiplePositions(views, activeId, data, index)[0];
}

export function createMultiplePositions(
    views: AITableView[],
    activeId: string,
    data: AITableViewRecords | AITableViewFields,
    targetIndex: number = data.length - 1,
    count: number = 1,
    isInsertUpward: boolean = false
) {
    const positionsOfItems = getPositions(activeId, data, targetIndex, count, isInsertUpward);
    const viewsMaxPosition: Record<string, number> = {};
    views.forEach((view) => {
        viewsMaxPosition[view._id] = getMaxPosition(data, view._id);
    });
    const positions = positionsOfItems.map((itemPositions) => {
        const viewPositions: Positions = {};
        views.forEach((view) => {
            if (view._id === activeId) {
                viewPositions[view._id] = itemPositions;
            } else {
                viewsMaxPosition[view._id] += 1;
                viewPositions[view._id] = viewsMaxPosition[view._id];
            }
        });
        return viewPositions;
    });
    return positions;
}

export function getPositions(
    activeId: string,
    data: AITableViewRecords | AITableViewFields,
    targetIndex: number = data.length - 1,
    count: number = 1,
    isInsertBefore: boolean = false
) {
    let startPosition = data[data.length - 1].positions[activeId!];
    let endPosition = startPosition + count + 1;
    if (data[targetIndex]) {
        if (isInsertBefore) {
            endPosition = data[targetIndex].positions[activeId!];
            startPosition = targetIndex - 1 >= 0 ? data[targetIndex - 1].positions[activeId!] : endPosition - count - 1;
        } else {
            startPosition = data[targetIndex].positions[activeId!];
            endPosition =
                targetIndex + 1 < data.length
                    ? data[targetIndex + 1].positions[activeId!]
                    : data[targetIndex].positions[activeId!] + count + 1;
        }
    }
    const step = (endPosition - startPosition) / (count + 1);
    const positions = _.range(startPosition + step, endPosition, step);
    return positions;
}

export function getPosition(data: AITableViewRecords | AITableViewFields, activeViewId: string, index?: number) {
    return getPositions(activeViewId, data, index)[0];
}

export function getMaxPosition(data: AITableViewRecords | AITableViewFields, activeViewId: string) {
    return data.reduce((maxPosition, item) => {
        if (item.positions[activeViewId] > maxPosition) {
            maxPosition = item.positions[activeViewId];
        }
        return maxPosition;
    }, Number.MIN_SAFE_INTEGER);
}

export function addView(aiTable: AIViewTable, type: 'add' | 'duplicate', viewId?: string) {
    const newId = idCreator();
    const shortId = shortIdCreator();
    const views = aiTable.views();
    const allViewNames = views.map((item) => item.name);
    const count = views.length || 0;
    const newViewName = generateNewName(allViewNames, count, getStateI18nTextByKey(aiTable, AITableStateI18nKey.tableView));
    let newView: AITableView = {
        _id: newId,
        short_id: shortId,
        name: newViewName
    };

    let originViewId = views[views.length - 1]._id;
    if (type === 'duplicate') {
        originViewId = viewId ?? aiTable.activeViewId();
        const copyView = views.find((item) => item._id === originViewId)!;

        const copyName = copyView.name;
        const copyViewName = generateCopyName(aiTable, allViewNames, copyName);
        newView = {
            ...copyView,
            _id: newId,
            name: copyViewName
        };
    }
    ViewActions.addView(aiTable, originViewId, newView, type === 'duplicate');
    const actions: AITableAction[] = [];
    (aiTable.records() as AITableViewRecords).forEach((record, index) => {
        const action = buildSetRecordPositionsAction(aiTable, { [newId]: record.positions[originViewId] }, [index]);
        actions.push(action);
    });
    (aiTable.fields() as AITableViewFields).forEach((field) => {
        const action = buildSetFieldAction(
            aiTable,
            {
                positions: {
                    ...field.positions,
                    [newId]: field.positions[originViewId]
                }
            },
            [field._id]
        );
        if (action) {
            actions.push(action);
        }
    });
    aiTable.apply(actions);
    return newView;
}

export function removeView(aiTable: AIViewTable, records: AITableViewRecords, fields: AITableViewFields, activeViewId: string) {
    ViewActions.removeView(aiTable, [activeViewId]);
    const actions: AITableAction[] = [];
    records.forEach((record, index) => {
        const action = buildSetRecordPositionsAction(aiTable, { [activeViewId]: undefined }, [index]);
        actions.push(action);
    });
    fields.forEach((field) => {
        const positions = { ...field.positions };
        delete positions[activeViewId];
        const action = buildSetFieldAction(
            aiTable,
            {
                positions
            },
            [field._id]
        );
        if (action) {
            actions.push(action);
        }
    });
    aiTable.apply(actions);
}

export function sortViews(data: AITableView[]) {
    return [...data].sort((a, b) => (a.position ?? data.indexOf(a)) - (b.position ?? data.indexOf(b)));
}
