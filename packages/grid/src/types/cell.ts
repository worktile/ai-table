import Konva from 'konva';
import { AITable, AITableField, Coordinate, FieldValue } from '../core';
import { AITableLinearRowRecord } from './row';

export interface AITableCellsOptions {
    aiTable: AITable;
    coordinate: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    columnStartIndex: number;
    columnStopIndex: number;
}

export interface AITableCellsDrawerOptions extends AITableCellsOptions {
    ctx: Konva.Context | CanvasRenderingContext2D;
}

export interface AITableRender {
    x: number;
    y: number;
    columnWidth: number;
    rowHeight: number;
    recordId: string;
    field: AITableField;
    cellValue: FieldValue;
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

export interface AITableDynamicCellsOptions {
    aiTable: AITable;
    coordinate: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    columnStartIndex: number;
    columnStopIndex: number;
}

export interface AITableCellHeightOptions {
    field: AITableField | null;
    rowHeight: number;
    activeHeight?: number;
    isActive?: boolean;
}

export interface AITablePlaceholderDrawerOptions {
    aiTable: AITable;
    coordinate: Coordinate;
    columnStartIndex: number;
    columnStopIndex: number;
    rowStartIndex: number;
    rowStopIndex: number;
}

export interface AITableActiveCellOptions {
    aiTable: AITable;
    coordinate: Coordinate;
    columnStartIndex: number;
    columnStopIndex: number;
    rowStartIndex: number;
    rowStopIndex: number;
}
