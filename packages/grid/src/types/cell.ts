import Konva from 'konva';
import { AITableField, FieldValue } from '../core';

export type AITableWrapTextData = {
    offsetX: number;
    offsetY: number;
    width: number;
    text: string;
}[];

export interface AITableRenderContentBase {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    id: string;
    style: {
        background?: string;
        color?: string;
        textAlign?: 'left' | 'center' | 'right';
        textDecoration?: 'underline' | 'line-through';
        fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
    };
    textData?: AITableWrapTextData;
    favicon?: string;
}
export interface AITableRenderData {
    width: number;
    height: number;
    isOverflow: boolean;
    renderContent: AITableRenderContentBase | AITableRenderContentBase[] | null;
}

export interface AITableCellOptions {
    field: AITableField;
    recordId: string;
    x: number;
    y: number;
    rowHeight: number;
    columnWidth: number;
    cellValue: FieldValue;
    renderData: AITableRenderData;
    isActive?: boolean;
    style?: Konva.ShapeConfig;
}

export interface AITableCell {
    x: number;
    y: number;
    rowHeight: number;
    columnWidth: number;
    field: AITableField;
    recordId: string;
    cellValue: FieldValue;
    renderData: AITableRenderData;
    isActive?: boolean;
    style?: Konva.ShapeConfig & { background?: string };
}

export interface AITableCellScrollContainerOptions {
    x: number;
    y: number;
    columnWidth: number;
    rowHeight: number;
    fieldId: string;
    recordId: string;
    renderData: AITableRenderData;
    children: any;
    [key: string]: any;
}
