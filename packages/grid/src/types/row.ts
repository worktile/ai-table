import { ElementRef, ViewContainerRef } from '@angular/core';
import { AITable, Coordinate } from '../core';
import { ThyNotifyService } from 'ngx-tethys/notify';

export enum AITableRowType {
    add = 'add',
    record = 'record',
    group = 'group',
    blank = 'blank'
}

export type AITableCellMetaData = {
    size: number;
    offset: number;
};

export type AITableCellMetaDataMap = Record<number, AITableCellMetaData>;

export interface AITableLinearRowBase {
    _id: string;
    depth?: number;
}

export interface AITableLinearRowAdd extends AITableLinearRowBase {
    type: AITableRowType.add;
}

export interface AITableLinearRowRecord extends AITableLinearRowBase {
    type: AITableRowType.record;
    displayIndex: number;
}

export interface AITableLinearRowGroup extends AITableLinearRowBase {
    type: AITableRowType.group;
    fieldId: string;
    groupValue: any;
    isCollapsed: boolean;
    recordCount: number;
    groupId: string;
}

export interface AITableLinearRowBlank extends AITableLinearRowBase {
    type: AITableRowType.blank;
}

export type AITableLinearRow = AITableLinearRowAdd | AITableLinearRowRecord | AITableLinearRowGroup | AITableLinearRowBlank;

export interface AITableRowHeadsConfig {
    coordinate: Coordinate;
    rowStartIndex: number;
    rowStopIndex: number;
    aiTable: AITable;
    readonly: boolean;
    maxRecords?: number;
}

export interface AITableContextMenuItem {
    type: string;
    name?: string;
    icon?: string;
    shortcutKey?: string;
    isInputNumber?: boolean;
    nameSuffix?: string;
    count?: number;
    exec?: (
        aiTable: AITable,
        targetName: string,
        position: { x: number; y: number },
        notifyService: ThyNotifyService,
        moduleValue?: any
    ) => void;
    hidden?: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => boolean;
    disabled?: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => boolean;
}

export interface AITableContextMenuOptions {
    origin: ElementRef<any> | HTMLElement;
    position: { x: number; y: number };
    menuItems: AITableContextMenuItem[];
    targetName: string;
    viewContainerRef: ViewContainerRef;
}

export type IndicesMap = Record<number, number>;
