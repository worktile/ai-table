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

export interface AITableScrollState {
    scrollTop: number;
    scrollLeft: number;
}

export interface AITableCellScrollState {
    scrollTop: number;
    totalHeight: number;
    isOverflow: boolean;
}

export type AITableCellBound = {
    width: number;
    height: number;
};

export interface AITableEditPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type AITablePointPosition = {
    x: number;
    y: number;
    targetName: string; // 用于粗略识别用户点击的类型，比如单元格（cell）、表头（head）、操作按钮（operation）等
    realTargetName: string; // 实际的目标名称，包含了更具体的上下文信息，比如对应的 fieldId、recordId 等。结合 realAreaType，它可以精确识别用户点击的特定区域
    rowIndex: number;
    columnIndex: number;
    offsetTop: number;
    offsetLeft: number;
};

export interface AITableContext {
    linearRows: AITableLinearRow[];
    scrollState: WritableSignal<AITableScrollState>;
    cellScrollState: WritableSignal<AITableCellScrollState>;
    activeCellBound: WritableSignal<AITableCellBound>;
    pointPosition: WritableSignal<AITablePointPosition>;
    toggleEditing?: (options: { aiTable: AITable; recordId: string; fieldId: string; position: AITableEditPosition }) => void;
}
