import { FieldPath, RecordPath, AITableField, AITableRecord } from '../core';

export enum AITableRowHeight {
    Short = 1,
    Medium = 2,
    Tall = 3,
    ExtraTall = 4
}

export interface AITableGridCellRenderSchema {
    edit: any;
}

export interface AITableGridData {
    type: 'grid';
    fields: AITableField[];
    records: AITableRecord[];
}

export type GridCellPath = [RecordPath, FieldPath];

export interface AITableSelection {
    selectedRecords: Map<string, boolean>;
    selectedFields: Map<string, boolean>;
    selectedCells: Map<string, {}>;
}
