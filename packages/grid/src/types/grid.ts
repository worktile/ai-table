import { Dictionary } from 'ngx-tethys/types';
import { AITable, AITableFieldType } from '../core';
import { AITableFieldMenuItem } from './field';

export interface AITableGridCellRenderSchema {
    editor: any;
}

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

export enum AITableRowColumnType {
    row = 'row',
    column = 'column'
}

export type AITableSizeMap = Record<number, number>;

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
