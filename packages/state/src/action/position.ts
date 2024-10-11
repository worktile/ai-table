import { ActionName, AddRecordPositionAction, AIViewTable, Positions, RemoveRecordPositionAction } from "../types";
import { IdPath } from "@ai-table/grid";

export function setRecordPosition(aiTable: AIViewTable, position: Positions, path: IdPath) {
    const operation: AddRecordPositionAction = {
        type: ActionName.AddRecordPosition,
        position,
        path
    };
    aiTable.apply(operation);
}

export function removeRecordPosition(aiTable: AIViewTable, path: [string, string]) {
    const operation: RemoveRecordPositionAction = {
        type: ActionName.RemoveRecordPosition,
        path
    };
    aiTable.apply(operation);
}

export const PositionActions = {
    setRecordPosition,
    removeRecordPosition
};
