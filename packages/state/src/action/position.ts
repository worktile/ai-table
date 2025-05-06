import { AIViewTable } from '../types';
import { ActionName, IdPath, Positions, RemovePositions, SetRecordPositionAction } from '@ai-table/utils';

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
