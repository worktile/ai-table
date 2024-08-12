import { AITable, AITableAction, AITableField, AITableRecord } from '@ai-table/grid';
import { WritableSignal } from '@angular/core';

export class Positions {
    [view_id: string]: number;
}

export interface AITableSharedRecord extends AITableRecord {
    positions: Positions;
}

export interface AITableSharedField extends AITableField {
    positions: Positions;
}

export type AITableSharedRecords = AITableSharedRecord[];

export type AITableSharedFields = AITableSharedField[];

export interface AITableSharedView {
    _id: string;
    name: string;
    [key: string]: any;
}

export interface SharedAITable extends AITable {
    views: WritableSignal<AITableSharedView[]>;
    apply: (action: AITableSharedAction) => void;
}

export enum ViewActionName {
    setView = 'set_view'
}

export interface SetViewAction {
    type: ViewActionName.setView;
    view: Partial<AITableSharedView>;
    newView: Partial<AITableSharedView>;
    path: [number];
}

export type AITableViewAction = SetViewAction;

export type AITableSharedAction = AITableViewAction | AITableAction;
