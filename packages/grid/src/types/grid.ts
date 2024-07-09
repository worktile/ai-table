import { FieldPath, RecordPath, VTableField, VTableRecord, VTableViewType }  from '../core';;

export enum VTableRowHeight {
    Short = 1,
    Medium = 2,
    Tall = 3,
    ExtraTall = 4
}

export interface VTableGridCellRenderSchema {
    edit: any;
}

export interface VTableGridData {
    type: VTableViewType.Grid;
    fields: VTableField[];
    records: VTableRecord[];
}

export type GridCellPath = [RecordPath, FieldPath];
