import { AITable, AITableAction, AITableField, AITableRecord } from '@ai-table/grid';
import { WritableSignal } from '@angular/core';

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

export interface AITableView {
    _id: string;
    name: string;
    emoji_icon?: string;
    isActive?: boolean;
    sortCondition?: {
        keepSort: boolean;
        conditions: {
            sortBy: string;
            direction: Direction;
        }[];
    };
    // filterCondition?: {
    //     fieldKey: string;
    //     operation: OperationSymbol;
    //     logical: LogicalOperator;
    //     value?: SafeAny;
    //     disabled?: boolean;
    // }[];
}

export interface AIViewTable extends AITable {
    views: WritableSignal<AITableView[]>;
    apply: (action: AITableSharedAction) => void;
}

export enum ViewActionName {
    setView = 'set_view'
}

export interface SetViewAction {
    type: ViewActionName.setView;
    view: Partial<AITableView>;
    newView: Partial<AITableView>;
    path: [number];
}

export type AITableViewAction = SetViewAction;

export type AITableSharedAction = AITableViewAction | AITableAction;
