import { FieldPath, RecordPath, VTableFields, VTableFieldType, VTableOption, VTableRecords, VTableValue, VTableViewType } from '@v-table/core';

export enum RowHeightLevel {
    Short = 1,
    Medium = 2,
    Tall = 3,
    ExtraTall = 4
}

export interface GridView extends VTableOption {
    id: string;
    type: VTableViewType.Grid;
    rowHeight?: RowHeightLevel;
}

export interface GridCellRenderSchema {
    // view?: any
    edit: any;
}

export interface GridConfig {
    cellRenderer?: Partial<Record<VTableFieldType, GridCellRenderSchema>>;
    readonly?: boolean;
}

export type GridData = GridView & VTableValue;

export type GridCellPath = [RecordPath, FieldPath];
