import Konva from 'konva';
import { AITableLinearRowRecord } from './row';
import { AITable, Coordinate } from '../core';
import { AITableReferences, AITableField, FieldValue, UpdateFieldValueOptions } from '@ai-table/utils';

export interface AITableCellsConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    columnStartIndex: number;
    columnStopIndex: number;
    readonly: boolean;
    actions: {
        updateFieldValues: (options: UpdateFieldValueOptions[]) => void;
    };
    references?: AITableReferences;
    maxRecords?: number;
}

export interface AITableCellsDrawerConfig extends AITableCellsConfig {
    ctx: Konva.Context | CanvasRenderingContext2D;
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
    zIndex?: number;
}

export interface AITableRenderStyle {
    color?: string;
    textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
}

export interface AITableCell {
    row: AITableLinearRowRecord;
    style?: AITableCellStyle;
    indexStyle?: AITableCellStyle;
    isHoverRow: boolean;
    isCheckedRow: boolean;
    width?: number;
    isDisabled?: boolean;
}

export interface AITableCellStyle {
    fill?: string;
    stroke?: string;
}
