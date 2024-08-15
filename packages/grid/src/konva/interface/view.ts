import { AITable, AITableFields, AITableRecords } from '@ai-table/grid';
import { Coordinate } from '../core/coordinate';
import { AITableScrollState } from './grid';

export interface AITableGridContext {
    aiTable: AITable;
    fields: AITableFields;
    records: AITableRecords;
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
    scrollState: AITableScrollState;
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
    scrollState: AITableScrollState;
    offsetX?: number;
}

export interface AITableUseHeads extends AITableGridBase {
    instance: Coordinate;
    columnStartIndex: number;
    columnStopIndex: number;
    scrollState: AITableScrollState;
}

export interface AITableUseGridBaseConfig extends AITableGridBase {
    instance: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    columnStartIndex: number;
    columnStopIndex: number;
}
