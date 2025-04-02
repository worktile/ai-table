import { idCreator, shortIdCreator } from '@ai-table/grid';
import { AITableView, AITableViewField, AITableViewFields, AITableViewRecords, AIViewTable, Positions } from '../types';
import { Actions } from '../action';
import { ViewActions } from '../action/view';
import { PositionsActions } from '../action/position';
import { generateCopyName } from './common';
import { generateNewName } from '@ai-table/grid';
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

export function addView(aiTable: AIViewTable, type: 'add' | 'copy', viewId?: string) {
    let index = aiTable.views().length;
    const newId = idCreator();
    const shortId = shortIdCreator();

    const allViewNames = aiTable.views().map((item) => item.name);
    const count = aiTable.views().length || 0;
    const newViewName = generateNewName(allViewNames, count, '表格视图');
    let newView: AITableView = {
        _id: newId,
        short_id: shortId,
        name: newViewName
    };

    let originViewId = aiTable.views()[aiTable.views().length - 1]._id;
    if (type === 'copy') {
        originViewId = viewId ?? aiTable.activeViewId();
        const copyView = aiTable.views().find((item) => item._id === originViewId)!;

        const copyName = copyView.name;
        const copyViewName = generateCopyName(allViewNames, copyName);
        newView = {
            ...copyView,
            _id: newId,
            name: copyViewName
        };
        index = aiTable.views().indexOf(copyView) + 1;
    }
    ViewActions.addView(aiTable, newView, [index]);
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
