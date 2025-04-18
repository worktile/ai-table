import Konva from 'konva';
import { AITable, AITableField, Coordinate, UpdateFieldValueOptions } from '../core';
import { AITableAttachmentInfo, AITablePointPosition } from './grid';
import { AITableRender } from './cell';

export interface AITableIconConfig extends Konva.ShapeConfig {
    size?: number;
}

export interface AITableActionIconConfig extends AITableIconConfig {
    coordinate: Coordinate;
    hoverBackground?: string;
    hoverFill?: string;
}

export interface AITableAttachmentConfig extends Konva.ShapeConfig {
    coordinate: Coordinate;
    attachmentInfo: AITableAttachmentInfo;
}

export interface AITableFieldTypeIconConfig {
    field: AITableField;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
}

export interface AITableFieldHeadConfig {
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

export interface AITableColumnHeadsConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    columnStartIndex: number;
    columnStopIndex: number;
    pointPosition: AITablePointPosition;
}

export interface AITableAddFieldConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    fields: AITableField[];
    columnStopIndex: number;
    pointPosition: AITablePointPosition;
    readonly?: boolean;
}

export interface AITableHoverCellConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    field: AITableField;
    recordId?: string;
    x: number;
    y: number;
    render: AITableRender;
    readonly: boolean;
    actions: {
        updateFieldValue: (options: UpdateFieldValueOptions) => void;
    };
}

export interface AITableTargetNameOptions {
    targetName: string;
    fieldId?: string;
    recordId?: string;
    mouseStyle?: string;
    source?: string;
}

export interface AITableTargetNameDetail {
    targetName: string | null;
    fieldId?: string | null;
    recordId?: string | null;
    mouseStyle?: string | null;
    source?: string | null;
}

export enum AITableMouseDownType {
    Left,
    Center,
    Right
}
