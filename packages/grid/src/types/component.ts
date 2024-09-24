import Konva from 'konva';
import { AITable, AITableField, Coordinate } from '../core';
import { AITablePointPosition } from './grid';

export interface AITableIconOptions extends Konva.ShapeConfig {
    size?: number;
}

export interface AITableFieldTypeIconOptions {
    field: AITableField;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
}

export interface AITableFieldHeadOptions {
    x?: number;
    y?: number;
    width: number;
    height: number;
    field: AITableField;
    stroke?: string;
    iconVisible?: boolean;
    isSelected?: boolean;
    isHoverIcon?: boolean;
}

export interface AITableCreateHeadsOptions {
    aiTable: AITable;
    coordinate: Coordinate;
    columnStartIndex: number;
    columnStopIndex: number;
    pointPosition: AITablePointPosition;
}

export interface AITableTargetNameOptions {
    targetName: string;
    fieldId?: string;
    recordId?: string;
    mouseStyle?: string;
}

export interface AITableTargetNameDetail {
    targetName: string | null;
    fieldId?: string | null;
    recordId?: string | null;
    mouseStyle?: string | null;
}

export enum AITableMouseDownType {
    Left,
    Center,
    Right
}
