import { AIViewTable } from '../types';
import { ActionName, NumberPath, Positions, RemovePositions, SetRecordPositionAction } from '@ai-table/utils';

export function setRecordPositions(aiTable: AIViewTable, positions: Positions | RemovePositions, path: NumberPath) {
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
