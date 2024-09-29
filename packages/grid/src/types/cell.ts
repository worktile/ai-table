import Konva from 'konva';
import { AITable, AITableField, Coordinate, FieldValue } from '../core';
import { AITableLinearRowRecord } from './row';

export interface AITableCellsConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    columnStartIndex: number;
    columnStopIndex: number;
}

export interface AITableCellsDrawerConfig extends AITableCellsConfig {
    ctx: Konva.Context | CanvasRenderingContext2D;
}

export interface AITableRender {
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
}

export interface AITableRenderStyle {
    color?: string;
    textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
}

export interface AITableCell {
    row: AITableLinearRowRecord;
    style?: any;
    isHoverRow: boolean;
    isCheckedRow: boolean;
    width?: number;
}
