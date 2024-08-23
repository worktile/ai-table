import { AITable, AITableFields, AITableRecords } from '@ai-table/grid';
import { DefaultTheme } from '../constants/default-theme';
import { Coordinate } from '../core/coordinate';
import { AILinearRow, AITableCellScrollState, AITableScrollState } from './grid';

export interface AITableGridContext {
    aiTable: AITable;
    fields: AITableFields;
    records: AITableRecords;
    linearRows: AILinearRow[];
    pointPosition: AITablePointPosition;
    isCellDown: boolean;
    canAppendRow: boolean;
    activeUrlAction: boolean;
    activeCellBound: CellBound;
    scrollState: AITableScrollState;
    cellScrollState: AITableCellScrollState;
    setPointPosition: (pointPosition: AITablePointPosition) => void;
    setCellDown: (cellDown: boolean) => void;
    setCanAppendRow: (canAppendRow: boolean) => void;
    setActiveUrlAction: (activeUrlAction: boolean) => void;
    setActiveCellBound: (activeCellBound: Partial<CellBound>) => void;
    setScrollState: (scrollState: Partial<AITableScrollState>) => void;
    setCellScrollState: (cellScrollState: Partial<AITableCellScrollState>) => void;
}

export interface AITableGridBase {
    context: AITableGridContext;
}

export interface AITableGridView extends AITableGridBase {
    height: number;
    width: number;
    container: HTMLDivElement | string;
}

export interface AITableKonvaGridStage extends AITableGridBase {
    instance: Coordinate;
    container: HTMLDivElement | string;
    offsetX?: number;
    listening?: boolean;
}

export interface AITableUseGrid extends AITableGridBase {
    instance: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    columnStartIndex: number;
    columnStopIndex: number;
    offsetX?: number;
}

export interface AITableUseHeads extends AITableGridBase {
    instance: Coordinate;
    columnStartIndex: number;
    columnStopIndex: number;
}

export interface AITableUseGridBaseConfig extends AITableGridBase {
    instance: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    columnStartIndex: number;
    columnStopIndex: number;
}

export interface AITableGroupInfo {
    fieldId: string;
    desc: boolean;
}

export interface AITableTheme {
    color: typeof DefaultTheme.color;
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
