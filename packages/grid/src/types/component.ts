import Konva from 'konva';
import { AITableField, Coordinate } from '../core';

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
}

export interface AITableCreateHeadsOptions {
    fields: AITableField[];
    instance: Coordinate;
    columnStartIndex: number;
    columnStopIndex: number;
}

export interface AITableTargetNameOptions {
    targetName: string;
    fieldId?: string;
    recordId?: string;
    mouseStyle?: string;
}
