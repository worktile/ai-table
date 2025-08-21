import { ElementRef, ViewContainerRef } from '@angular/core';
import { AITable, Coordinate } from '../core';
import { ThyNotifyService } from 'ngx-tethys/notify';

export enum AITableRowType {
    add = 'add',
    record = 'record',
    groupTab = 'groupTab',
    blank = 'blank'
}

export type AITableCellMetaData = {
    size: number;
    offset: number;
};

export type AITableCellMetaDataMap = Record<number, AITableCellMetaData>;

export type AITableLinearRowBase = {
    _id: string;
    depth?: number;
};

export type AITableLinearRowAdd = AITableLinearRowBase & {
    type: AITableRowType.add;
};

export type AITableLinearRowRecord = AITableLinearRowBase & {
    type: AITableRowType.record;
    displayIndex: number;
};

export type AITableLinearRowGroupTab = AITableLinearRowBase & {
    type: AITableRowType.groupTab;
    fieldId: string;
    groupValue: any;
    isCollapsed: boolean;
    recordCount: number;
    groupId: string;
};

export type AITableLinearRowBlank = AITableLinearRowBase & {
    type: AITableRowType.blank;
};

export type AITableLinearRow = AITableLinearRowAdd | AITableLinearRowRecord | AITableLinearRowGroupTab | AITableLinearRowBlank;

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
