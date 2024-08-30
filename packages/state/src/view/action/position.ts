import { AddRecordPositionAction, AIViewIdPath, AIViewTable, PositionActionName, Positions, RemoveRecordPositionAction } from '../../types';

export function addRecordPosition(aiTable: AIViewTable, position: Positions, path: AIViewIdPath) {
    const operation: AddRecordPositionAction = {
        type: PositionActionName.AddRecordPosition,
        position,
        path
    };
    aiTable.apply(operation);
}

export function removeRecordPosition(aiTable: AIViewTable, path: [string, string]) {
    const operation: RemoveRecordPositionAction = {
        type: PositionActionName.RemoveRecordPosition,
        path
    };
    aiTable.apply(operation);
}

export const PositionActions = {
    addRecordPosition,
    removeRecordPosition
};
