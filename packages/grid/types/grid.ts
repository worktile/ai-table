import {
    VTableField,
    VTableFieldType,
    VTableOperation,
    VTableRecord,
    VTableViewType,
} from "../../core";

export enum RowHeightLevel {
    Short = 1,
    Medium = 2,
    Tall = 3,
    ExtraTall = 4,
}

export interface GridView extends VTableOperation {
    id: string;
    type: VTableViewType.Grid;
    rowHeight?: RowHeightLevel;
}

export interface GridCellRenderSchema {
    view: any;
    edit: any;
}

export interface GridConfig {
    cellRenderer?: Partial<Record<VTableFieldType, GridCellRenderSchema>>;
    readonly?: boolean;
}

export interface GridData extends GridView {
    fields: VTableField[];
    records: VTableRecord[];
}