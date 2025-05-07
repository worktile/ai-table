import { idCreator, shortIdCreator } from '@ai-table/grid';
import { AITableView, AITableViewField, AITableViewFields, AITableViewRecords, Positions } from '@ai-table/utils';
import { Actions } from '../action';
import { ViewActions } from '../action/view';
import { PositionsActions } from '../action/position';
import { generateCopyName } from './common';
import { generateNewName } from '@ai-table/grid';
import { AITableStateI18nKey, getStateI18nTextByKey } from './i18n';
import { AIViewTable } from '../types';

export function createDefaultPositions(
    views: AITableView[],
    activeId: string,
    data: AITableViewRecords | AITableViewFields,
    index: number
) {
    const positions: Positions = {};
    const position = getPosition(data, activeId, index);
    views.forEach((element) => {
        if (element._id === activeId) {
            positions[element._id] = position;
        } else {
            positions[element._id] = getMaxPosition(data, element._id) + 1;
        }
    });
    return positions;
}

export function getPosition(data: AITableViewRecords | AITableViewFields, activeViewId: string, index: number) {
    let position = data.length - 1;
    if (index !== 0 && index !== data.length) {
        const previousViewPosition = data[index - 1].positions[activeViewId];
        const nextViewPosition = data[index].positions[activeViewId!];
        position = (previousViewPosition + nextViewPosition) / 2;
    } else {
        const maxPosition = getMaxPosition(data, activeViewId);
        position = maxPosition + 1;
    }
    return position;
}

export function getMaxPosition(data: AITableViewRecords | AITableViewFields, activeViewId: string) {
    return data.reduce((maxPosition, item) => {
        if (item.positions[activeViewId] > maxPosition) {
            maxPosition = item.positions[activeViewId];
        }
        return maxPosition;
    }, 0);
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
    (aiTable.records() as AITableViewRecords).forEach((record) => {
        PositionsActions.setRecordPositions(aiTable, { [newId]: record.positions[originViewId] }, [record._id]);
    });
    (aiTable.fields() as AITableViewFields).forEach((field) => {
        Actions.setField<AITableViewField>(
            aiTable,
            {
                positions: {
                    ...field.positions,
                    [newId]: field.positions[originViewId]
                }
            },
            [field._id]
        );
    });
    return newView;
}

export function removeView(aiTable: AIViewTable, records: AITableViewRecords, fields: AITableViewFields, activeViewId: string) {
    records.forEach((record) => {
        PositionsActions.setRecordPositions(aiTable, { [activeViewId]: undefined }, [record._id]);
    });
    fields.forEach((field) => {
        const positions = { ...field.positions };
        delete positions[activeViewId];
        Actions.setField<AITableViewField>(
            aiTable,
            {
                positions
            },
            [field._id]
        );
    });
    ViewActions.removeView(aiTable, [activeViewId]);
}

export function sortViews(data: AITableView[]) {
    return [...data].sort((a, b) => (a.position ?? data.indexOf(a)) - (b.position ?? data.indexOf(b)));
}
