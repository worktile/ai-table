import { ActionName, AITableField, AITableRecord, AITableValue } from '@ai-table/grid';

export class Positions {
    [view_id: string]: number;
}

export interface DemoAIField extends AITableField {
    positions: Positions;
}


export interface DemoAIRecord extends AITableRecord {
    positions: Positions;
}


export const UpdateRecordTypes = [ActionName.AddRecord, ActionName.RemoveRecord, ActionName.MoveRecord];

export const UpdateFieldTypes = [ActionName.AddField, ActionName.RemoveField, ActionName.MoveField];