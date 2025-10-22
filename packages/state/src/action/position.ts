import { AIViewTable } from '../types';
import {
    ActionName,
    AITableAction,
    AITableViewField,
    AITableViewRecord,
    NumberPath,
    Positions,
    RemovePositions,
    SetRecordPositionAction
} from '@ai-table/utils';
import { getSortFields, insertAtEnd, sortRecordsByConditions } from '../utils';
import { buildSetFieldAction } from './field';
import { buildSetViewAction } from './view';

export function buildSetRecordPositionsAction(aiTable: AIViewTable, positions: Positions | RemovePositions, path: NumberPath) {
    const action: SetRecordPositionAction = {
        type: ActionName.SetRecordPositions,
        positions,
        path
    };
    return action;
}

export function resetAllRecordsPositions(aiTable: AIViewTable) {
    const activeViewId = aiTable.activeViewId();
    const activeView = aiTable.views().find((view) => view._id === activeViewId);
    const records = aiTable.records() as AITableViewRecord[];
    const recordsIndexMap = new Map(records.map((item, index) => [item._id, index]));
    const sortedRecords = sortRecordsByConditions(aiTable, records, activeView!, []);
    const actions: AITableAction[] = [];
    const positions = insertAtEnd(0, sortedRecords.length);
    sortedRecords.forEach((record, index) => {
        const action = buildSetRecordPositionsAction(aiTable, { [activeView!._id]: positions[index] }, [recordsIndexMap.get(record._id)!]);
        actions.push(action);
    });
    aiTable.apply(actions);
}

export function resetAllFieldsPositions(aiTable: AIViewTable) {
    const activeViewId = aiTable.activeViewId();
    const activeView = aiTable.views().find((view) => view._id === activeViewId);
    const fields = aiTable.fields() as AITableViewField[];
    const sortedFields = getSortFields(aiTable, fields, activeView!);
    const actions: AITableAction[] = [];
    const positions = insertAtEnd(0, sortedFields.length);
    sortedFields.forEach((item, index) => {
        const action = buildSetFieldAction(aiTable, { positions: { ...item.positions, [activeView!._id]: positions[index] } }, [item._id]);
        if (action) {
            actions.push(action);
        }
    });
    aiTable.apply(actions);
}

export function resetAllViewsPositions(aiTable: AIViewTable) {
    const views = aiTable.views();
    const positions = insertAtEnd(0, views.length);
    const actions: AITableAction[] = [];
    views.forEach((v, i) => {
        const action = buildSetViewAction(aiTable, { position: positions[i] }, [v._id]);
        if (action) {
            actions.push(action);
        }
    });
    aiTable.apply(actions);
}

export function setRecordPositions(aiTable: AIViewTable, positions: Positions | RemovePositions, path: NumberPath) {
    const operation = buildSetRecordPositionsAction(aiTable, positions, path);
    aiTable.apply(operation);
}

export const PositionsActions = {
    setRecordPositions,
    resetAllRecordsPositions,
    resetAllFieldsPositions,
    resetAllViewsPositions
};
