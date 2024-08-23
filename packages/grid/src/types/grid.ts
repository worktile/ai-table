import { Dictionary } from 'ngx-tethys/types';
import { AITable, AITableFieldType } from '../core';
import { AITableFieldMenuItem, AITableSizeMap } from './field';
import { AITableRowType } from './record';

export interface AITableGridCellRenderSchema {
    editor: any;
}

export interface AITableLinearRowBase {
    depth: number;
    recordId: string;
}

export type AITableLinearRowBlank = AITableLinearRowBase & {
    type: AITableRowType.Blank;
};

export type AITableLinearRowAdd = AITableLinearRowBase & {
    type: AITableRowType.Add;
};

export type AITableLinearRowGroupTab = AITableLinearRowBase & {
    type: AITableRowType.GroupTab;
};

export type AITableLinearRowRecord = AITableLinearRowBase & {
    type: AITableRowType.Record;
    groupHeadRecordId: string;
    displayIndex: number;
};

export type AITableLinearRow = AITableLinearRowBlank | AITableLinearRowAdd | AITableLinearRowGroupTab | AITableLinearRowRecord;

export interface AITableSelection {
    selectedRecords: Map<string, boolean>;
    selectedFields: Map<string, boolean>;
    selectedCells: Map<string, {}>;
}

export interface AIFieldConfig {
    fieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>;
    fieldPropertyEditor?: any;
    fieldMenus?: AITableFieldMenuItem[];
}

export interface AITableUserInfo {
    uid?: string;
    display_name?: string;
    avatar?: string;
}

export interface AITableReferences {
    members: Dictionary<AITableUserInfo>;
}

export interface AITableGridStageOptions {
    aiTable: AITable;
    container: HTMLDivElement;
    width: number;
    height: number;
}

export interface AITableGroupInfo {
    fieldId: string;
    desc: boolean;
}

export enum AITableItemType {
    Row = 'Row',
    Column = 'Column'
}

export interface AITableCoordinate {
    rowCount: number;
    columnCount: number;
    containerWidth: number;
    containerHeight: number;
    rowHeight: number;
    columnWidth: number;
    rowInitSize?: number;
    rowIndicesMap: AITableSizeMap;
    columnIndicesMap: AITableSizeMap;
    columnInitSize?: number;
    frozenColumnCount?: number;
}
