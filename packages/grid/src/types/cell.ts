import Konva from 'konva';
import { AITableLinearRow, AITableLinearRowGroup, AITableLinearRowRecord } from './row';
import { AITable, Coordinate } from '../core';
import { AITableReferences, AITableField, FieldValue, UpdateFieldValueOptions, AIRecordFieldIdPath } from '@ai-table/utils';
import { Colors } from '../constants';
import { AITableActions } from '../utils';

export interface AITableCellsConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    columnStartIndex: number;
    columnStopIndex: number;
    readonly: boolean;
    actions: AITableActions;
    references?: AITableReferences;
    maxRecords?: number;
}

export interface AITableCellsDrawerConfig extends AITableCellsConfig {
    ctx: Konva.Context | CanvasRenderingContext2D;
}

export interface AITableGroupOptionsConfig extends AITableCellsConfig {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface AITableRender<TR extends AITableReferences = AITableReferences> {
    aiTable: AITable;
    x: number;
    y: number;
    columnWidth: number;
    rowHeight: number;
    recordId: string;
    field: AITableField;
    cellValue: FieldValue;
    transformValue: any;
    isActive: boolean;
    style: AITableRenderStyle;
    references?: TR;
    isCoverCell?: boolean;
    colors?: typeof Colors;
    zIndex?: number;
    isGroupFirstRender?: boolean;
}

export interface AITableRenderStyle {
    color?: string;
    textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
}

export interface AITableCell<T extends AITableLinearRow = AITableLinearRow> {
    row: T;
    style?: AITableCellStyle;
    indexStyle?: AITableCellStyle;
    isHoverRow: boolean;
    isCheckedRow: boolean;
    width?: number;
    isDisabled?: boolean;
}

export interface AITableCellInfo {
    path: AIRecordFieldIdPath | null;
    width?: number;
    height?: number;
}

export interface AITableCellStyle {
    fill?: string;
    stroke?: string;
}
