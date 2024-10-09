import { AITableFieldType } from '../core';

export type AITableFontWeight = 'normal' | 'bold' | 'bolder' | 'lighter';

export interface AITableCtxStyle {
    fontSize?: number;
    fontWeight?: AITableFontWeight;
    fillStyle?: string;
    strokeStyle?: string;
}

export interface AITableTextEllipsis {
    text: string;
    maxWidth?: number;
    fontSize?: number;
    fontWeight?: AITableFontWeight;
}

export type AITableWrapTextData = {
    offsetX: number;
    offsetY: number;
    text: string;
    width: number;
}[];

export interface AITableWrapTextResult {
    height: number;
    data: AITableWrapTextData;
}

export interface AITableGraph {
    x: number;
    y: number;
}

export interface AITableLine extends AITableGraph {
    points: number[];
    stroke?: string;
    closed?: boolean;
}

export interface AITableRect extends AITableGraph {
    width: number;
    height: number;
    fill?: string;
    stroke?: string;
    radius?: number[] | number;
    strokes?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
    };
}

export interface AITableArc extends AITableGraph {
    fill?: string;
    stroke?: string;
    radius: number;
}

export interface AITableText extends AITableGraph {
    text: string;
    fillStyle?: string;
    fontSize?: number;
    textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    fontWeight?: AITableFontWeight;
    textDecoration?: 'underline' | 'line-through' | 'none';
}

export interface AITableWrapText extends AITableText {
    maxWidth: number;
    lineHeight: number;
    fieldType: AITableFieldType;
    maxRow?: number;
    originValue?: any[] | null;
    isLinkSplit?: boolean;
    needDraw?: boolean;
}

export type AITableLabel = Omit<AITableRect & AITableText, 'fillStyle'> & {
    background: string;
    color?: string;
    padding?: number;
};

export interface AITableImage extends AITableGraph {
    name: string;
    url: string;
    width: number;
    height: number;
    opacity?: number;
    clipFunc?: (ctx: any) => void;
}
