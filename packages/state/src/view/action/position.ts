import {
    AddRecordPositionAction,
    AITableViewPath,
    AIViewTable,
    PositionActionName,
    Positions,
    RemoveRecordPositionAction,
} from '../../types';

export function addRecordPosition(aiTable: AIViewTable, positions: Positions, path: AITableViewPath) {
    const operation: AddRecordPositionAction = {
        type: PositionActionName.AddRecordPosition,
        positions,
        path
    };
    aiTable.apply(operation);
}

export function removePosition(aiTable: AIViewTable, path: AITableViewPath) {
    const operation: RemoveRecordPositionAction = {
        type: PositionActionName.RemoveRecordPosition,
        path
    };
    aiTable.apply(operation);
}

export const PositionActions = {
    addRecordPosition,
    removePosition
};
