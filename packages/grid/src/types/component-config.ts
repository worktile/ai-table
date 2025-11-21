import Konva from 'konva';
import { AITable, Coordinate } from '../core';
import { AITableAttachmentInfo, AITableField, UpdateFieldValueOptions } from '@ai-table/utils';
import { AITableRender } from './cell';
import { AITablePointPosition } from './grid';
import { AITableActions } from '../utils';
import { AITableGroupStatRow } from './row';

export interface AITableIconConfig extends Konva.ShapeConfig {
    size?: number;
    disabled?: boolean;
}

export interface AITableBackgroundConfig extends Konva.ShapeConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    readonly?: boolean;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    name?: string;
    hoverFill?: string;
    hoverStroke?: string;
    hoverStrokeWidth?: number;
    hoverOpacity?: number;
    hoverName?: string;
    hoverWidth?: number;
    hoverHeight?: number;
    borders?: [boolean, boolean, boolean, boolean]; // 上边框，右边框，下边框，左边框
    listening?: boolean;
    coordinate?: Coordinate;
}

export interface AITableActionIconConfig extends AITableIconConfig {
    coordinate: Coordinate;
    coverBackground?: string;
    hoverFill?: string;
    source?: any;
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
    path?: string;
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

export interface AITableFieldStatConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    actions: AITableActions;
    columnIndex: number;
    isHoverStatContainer?: boolean;
    x?: number;
    y?: number;
    readonly?: boolean;
    width: number;
    height: number;
    field: AITableField;
}

export interface AITableGroupStatConfig extends AITableFieldStatConfig {
    isGroupStat: boolean;
    groupRow: AITableGroupStatRow;
}

export interface AITableGroupConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    rowIndex: number;
    x?: number;
    y?: number;
    readonly?: boolean;
    height: number;
    row: AITableGroupStatRow;
}

export interface AITableColumnHeadsConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    columnStartIndex: number;
    columnStopIndex: number;
    pointPosition: AITablePointPosition;
}

export interface AITableFieldStatsConfig {
    aiTable: AITable;
    actions: AITableActions;
    x: number;
    y: number;
    width?: number;
    height?: number;
    coordinate: Coordinate;
    columnStartIndex: number;
    columnStopIndex: number;
    isHoverStatContainer?: boolean;
    readonly?: boolean;
    groupRow?: AITableGroupStatRow;
}

export interface AITableAddFieldConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    fields: AITableField[];
    columnStopIndex: number;
    pointPosition: AITablePointPosition;
    readonly?: boolean;
    maxFields?: number;
}

export interface AITableCoverCellConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    field: AITableField;
    recordId?: string;
    x: number;
    y: number;
    render: AITableRender;
    readonly: boolean;
    isExpand: boolean;
    actions: {
        updateFieldValues: (options: UpdateFieldValueOptions[]) => void;
    };
}

export interface AITableFillHandleConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    readonly: boolean;
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
    Left = 0,
    Center = 1,
    Right = 2
}

export interface AITableExpandRecordConfig {
    aiTable: AITable;
    coordinate: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
}