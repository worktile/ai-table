import { AITableField, AITableFieldType, FieldValue } from '@ai-table/grid';
import { RowHeightLevel } from '../constants/grid';

// index - size
export type IndicesMap = Record<number, number>;

export type CellMetaData = {
    size: number;
    offset: number;
};

export type CellMetaDataMap = Record<number, CellMetaData>;

export enum ItemType {
    Row = 'Row',
    Column = 'Column'
}

export interface AITableCoordinate {
    rowCount: number;
    columnCount: number;
    containerWidth: number;
    containerHeight: number;
    rowHeight: number;
    columnWidth: number;
    rowIndicesMap?: IndicesMap;
    columnIndicesMap?: IndicesMap;
    rowInitSize?: number;
    columnInitSize?: number;
    rowHeightLevel?: RowHeightLevel;
    frozenColumnCount?: number;
    autoHeadHeight?: boolean;
}

export interface AITableRender {
    x: number;
    y: number;
    columnWidth: number;
    rowHeight: number;
    recordId: string;
    field: AITableField;
    cellValue: FieldValue;
    rowHeightLevel: RowHeightLevel;
    style: AITableRenderStyle;
}

export interface AITableRenderStyle {
    color?: string;
    bgColor?: string; // Background color for gantt view
    textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter';
}

export interface AITableScrollState {
    scrollTop: number;
    scrollLeft: number;
    isScrolling: boolean;
}

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
}

export interface AITableText extends AITableGraph {
    text: string;
    fillStyle?: string;
    fontSize?: number;
    textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    fontWeight?: AITableFontWeight;
    textDecoration?: 'underline' | 'line-through' | 'none';
    favicon?: string;
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

export enum CellType {
    GroupTab = 'GroupTab',
    Add = 'AddRecord',
    Blank = 'Blank',
    Record = 'Record'
}

export type AILinearRowBase = {
    depth: number;
    recordId: string;
};
export type AILinearRowBlank = AILinearRowBase & {
    type: CellType.Blank;
};

export type AILinearRowAdd = AILinearRowBase & {
    type: CellType.Add;
};

export type AILinearRowGroupTab = AILinearRowBase & {
    type: CellType.GroupTab;
};

export type AILinearRowRecord = AILinearRowBase & {
    type: CellType.Record;
    groupHeadRecordId: string;
    displayIndex: number;
};

export type AILinearRow = AILinearRowBlank | AILinearRowAdd | AILinearRowGroupTab | AILinearRowRecord;
