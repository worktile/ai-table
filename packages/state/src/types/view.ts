import { AITable, AITableAction, AITableField, AITableRecord } from '@ai-table/grid';
import { WritableSignal } from '@angular/core';
import { Id, Ids } from 'ngx-tethys/types';

export type Positions = Ids;

// export interface AITableRecord extends AITableRecord {
//     positions: Positions;
// }

// export interface AITableField extends AITableField {
//     positions: Positions;
// }

// export type AITableRecords = AITableRecord[];

// export type AITableFields = AITableField[];

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
    recordPositions: Positions;
    fieldPositions: Positions;
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

export type AIViewPath = [string];

export interface AIViewTable extends AITable {
    views: WritableSignal<AITableView[]>;
    apply: (action: AITableSharedAction) => void;
}

export enum ViewActionName {
    SetView = 'set_view',
    AddView = 'add_view',
    RemoveView = 'remove_view',
    AddPosition = 'add_position',
    AddRecordPositions = 'add_record_position',
    RemovePositions = 'remove_position'
}

export interface SetViewAction {
    type: ViewActionName.SetView;
    properties: Partial<AITableView>;
    newProperties: Partial<AITableView>;
    path: AIViewPath;
}

export interface AddViewAction {
    type: ViewActionName.AddView;
    view: AITableView;
    path: [number];
}

export interface RemoveViewAction {
    type: ViewActionName.RemoveView;
    path: AIViewPath;
}

export type AddPositionKey = 'recordPositions' | 'fieldPositions';

export interface AddPositionAction {
    type: ViewActionName.AddPosition;
    key: AddPositionKey;
    node: string;
    path: [number];
}

export type AITableViewAction = SetViewAction | AddViewAction | RemoveViewAction | AddPositionAction;

export type AITableSharedAction = AITableViewAction | AITableAction;
