import { AITable, AITableAction, AITableField, AITableRecord } from '@ai-table/grid';
import { WritableSignal } from '@angular/core';
import { Id } from 'ngx-tethys/types';

export class Positions {
    [view_id: string]: number;
}

export interface AITableViewRecord extends AITableRecord {
    positions: Positions;
}

export interface AITableViewField extends AITableField {
    positions: Positions;
}

export type AITableViewRecords = AITableViewRecord[];

export type AITableViewFields = AITableViewField[];

export enum Direction {
    default = 0,
    ascending = 1,
    descending = -1
}

export enum LogicalOperator {
    and = 'and',
    or = 'or'
}

export enum FilterOperationSymbol {
    eq = 'eq',
    gte = 'gte',
    lte = 'lte',
    gt = 'gt',
    lt = 'lt',
    in = 'in',
    contain = 'contain',
    ne = 'ne',
    nin = 'nin',
    between = 'between',
    besides = 'besides',
    empty = 'empty',
    exists = 'exists',
    notContain = 'not_contain'
}

export interface AITableView {
    _id: string;
    name: string;
    emoji_icon?: string;
    settings?: GridSettings;
}

export class GridSettings {
    is_keep_sort?: boolean;
    sorts?: {
        sort_by: Id;
        direction: Direction;
        // xxx
    }[];
    condition_logical?: LogicalOperator;
    conditions?: {
        field_id: Id;
        operation: FilterOperationSymbol;
        value: string | []; // TODO 明确类型
    }[];
}

export type AITableViews = AITableView[];

export type AITableViewPath = [string];

export interface AIViewTable extends AITable {
    views: WritableSignal<AITableView[]>;
    activeViewId: WritableSignal<string>;
    apply: (action: AITableSharedAction) => void;
}

export enum ViewActionName {
    SetView = 'set_view',
    AddView = 'add_view',
    RemoveView = 'remove_view'
}

export enum PositionActionName {
    AddRecordPosition = 'add_record_position',
    RemoveRecordPosition = 'remove_position'
}

export interface SetViewAction {
    type: ViewActionName.SetView;
    properties: Partial<AITableView>;
    newProperties: Partial<AITableView>;
    path: AITableViewPath;
}

export interface AddViewAction {
    type: ViewActionName.AddView;
    view: AITableView;
    path: [number];
}

export interface RemoveViewAction {
    type: ViewActionName.RemoveView;
    path: AITableViewPath;
}

export interface AddRecordPositionAction {
    type: PositionActionName.AddRecordPosition;
    positions: Positions;
    path: AITableViewPath;
}

export interface RemoveRecordPositionAction {
    type: PositionActionName.RemoveRecordPosition;
    path: AITableViewPath;
}

export type AITableViewAction = SetViewAction | AddViewAction | RemoveViewAction;

export type AITablePositionAction = AddRecordPositionAction | RemoveRecordPositionAction;

export type AITableSharedAction = AITableViewAction | AITableAction | AITablePositionAction;
