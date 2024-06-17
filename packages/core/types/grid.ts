import { ResourceType } from "./core";

export interface GridColumn {
    id: string;
    name: string;
    type: ColumnType;
    width?: string;
    hidden?: boolean;
    frozen?: boolean;
    stat?: "unique" | "count" | string; // 统计
    [key: string]: any;
}

export interface GridView {
    id: string;
    name: string;
    type: ResourceType.grid;
    columns: GridColumn[];
    rowHeight?: {
        name: string;
        type: "low" | "middle" | "high";
        value: number;
    };
    groupInfo?: {
        columnId: string;
        type: "asc" | "desc";
        collapse?: boolean;
    }[];
    sort?: {
        columnId?: string;
        type: "asc" | "desc";
    };
    filter?: {
        operator?: "or" | " and";
        options: any[];
    };
}

export interface GridData extends GridView {
    rows: {
        id: string;
        value: {
            [key: string]: any;
        };
        parentId?: string;
    }[];
}

export enum ColumnType {
    text = "text",
    select = "select",
}
