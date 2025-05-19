import { AIViewTable } from '../types';
import { ActionName, NumberPath, Positions, RemovePositions, SetRecordPositionAction } from '@ai-table/utils';

export function buildSetRecordPositionsActon(aiTable: AIViewTable, positions: Positions | RemovePositions, path: NumberPath) {
    const action: SetRecordPositionAction = {
        type: ActionName.SetRecordPositions,
        positions,
        path
    };
    return action;
}

export function setRecordPositions(aiTable: AIViewTable, positions: Positions | RemovePositions, path: NumberPath) {
    const operation = buildSetRecordPositionsActon(aiTable, positions, path);
    aiTable.apply(operation);
}

export const PositionsActions = {
    setRecordPositions
};
