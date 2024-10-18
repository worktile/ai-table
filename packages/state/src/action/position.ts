import { ActionName, SetRecordPositionAction, AIViewTable, Positions, RemovePositions } from '../types';
import { IdPath } from '@ai-table/grid';

export function setRecordPositions(aiTable: AIViewTable, positions: Positions | RemovePositions, path: IdPath) {
    const operation: SetRecordPositionAction = {
        type: ActionName.SetRecordPositions,
        positions,
        path
    };
    aiTable.apply(operation);
}

export const PositionsActions = {
    setRecordPositions
};
