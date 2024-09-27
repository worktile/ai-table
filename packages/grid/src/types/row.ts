import { AITable, Coordinate } from '../core';

export enum AITableRowType {
    add = 'add',
    record = 'record'
}

export type AITableCellMetaData = {
    size: number;
    offset: number;
};

export type AITableCellMetaDataMap = Record<number, AITableCellMetaData>;

export type AITableLinearRowAdd = {
    _id: string;
    type: AITableRowType.add;
};

export type AITableLinearRowRecord = {
    _id: string;
    type: AITableRowType.record;
    displayIndex: number;
};

export type AITableLinearRow = AITableLinearRowAdd | AITableLinearRowRecord;

export interface AITableRowHeadsConfig {
    coordinate: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    aiTable: AITable;
}
