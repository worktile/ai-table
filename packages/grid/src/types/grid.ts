import { Signal, WritableSignal } from '@angular/core';
import { Dictionary } from 'ngx-tethys/types';
import { AITable, AITableField, AITableFieldType, AITableRecord, Coordinate } from '../core';
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
    container: HTMLDivElement;
    width: number;
    height: number;
    coordinate: Coordinate;
}

export enum AITableRowColumnType {
    row = 'row',
    column = 'column'
}

export type AITableSizeMap = Record<number, number>;

export interface AITableCoordinate {
    rowCount: number;
    columnCount: number;
    container: HTMLDivElement;
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

export enum AITableAreaType {
    grid = 'grid',
    none = 'none'
}

export interface AITableEditPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type AITablePointPosition = {
    x: number;
    y: number;
    areaType: AITableAreaType;
    targetName: string;
    realTargetName: string;
    rowIndex: number;
    columnIndex: number;
    offsetTop: number;
    offsetLeft: number;
};

export interface AITableContext {
    linearRows: Signal<AITableLinearRow[]>;
    pointPosition: WritableSignal<AITablePointPosition>;
    scrollState: WritableSignal<AITableScrollState>;
    toggleEditing?: (options: { aiTable: AITable; recordId: string; fieldId: string; position: AITableEditPosition }) => void;
}
