import { WritableSignal } from '@angular/core';
import { Dictionary } from 'ngx-tethys/types';
import { AITable, AITableField, AITableFieldType, AITableRecord } from '../core';
import { AITableFieldMenuItem } from './field';
import { AITableLinearRow } from './row';

export interface AITableGridCellRenderSchema {
    editor: any;
}
export interface AITableGridData {
    type: 'grid';
    fields: AITableField[];
    records: AITableRecord[];
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
    context: AITableContext;
    container: HTMLDivElement;
    width: number;
    height: number;
    linearRows: AITableLinearRow[];
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

export enum AITableCheckType {
    checked = 'checked',
    unchecked = 'unchecked'
}

export type AITablePointPosition = {
    x: number; // 鼠标在可见区域的横坐标
    y: number; // 鼠标在可见区域的纵坐标
    targetName: string; // 模糊的目标名称，仅用于识别点击区域的类型，例如单元格、表头、操作等
    realTargetName: string; // 真实的目标名称，包括相应的 fieldId、recordId 等，并结合 areaType 来识别有效点击区域。
    rowIndex: number;
    columnIndex: number;
    offsetTop: number;
    offsetLeft: number;
};

export type CellBound = {
    width: number;
    height: number;
};

export interface AITableScrollState {
    scrollTop: number;
    scrollLeft: number;
    isScrolling?: boolean;
}

export interface AITableCellScrollState {
    scrollTop: number;
    totalHeight: number;
    isOverflow: boolean;
}

export interface AITableContext {
    linearRows: AITableLinearRow[];
    scrollState: WritableSignal<AITableScrollState>;
    cellScrollState: WritableSignal<AITableCellScrollState>;
}
