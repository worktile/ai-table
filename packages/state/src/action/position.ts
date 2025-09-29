import { AIViewTable } from '../types';
import {
    ActionName,
    AITableAction,
    AITableViewRecord,
    NumberPath,
    Positions,
    RemovePositions,
    SetRecordPositionAction
} from '@ai-table/utils';
import { insertAtEnd, sortRecordsByConditions } from '../utils';

export function buildSetRecordPositionsActon(aiTable: AIViewTable, positions: Positions | RemovePositions, path: NumberPath) {
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
        const action = buildSetRecordPositionsActon(aiTable, { [activeView!._id]: positions[index] }, [recordsIndexMap.get(record._id)!]);
        actions.push(action);
    });
    aiTable.apply(actions);
}

export function setRecordPositions(aiTable: AIViewTable, positions: Positions | RemovePositions, path: NumberPath) {
    const operation = buildSetRecordPositionsActon(aiTable, positions, path);
    aiTable.apply(operation);
}

export const PositionsActions = {
    setRecordPositions,
    resetAllRecordsPositions
};
