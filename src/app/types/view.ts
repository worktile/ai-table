import { AITable } from '@ai-table/grid';
import { Signal, WritableSignal } from '@angular/core';

export enum RowHeight {
    short = 'short',
    medium = 'medium',
    tall = 'tall'
}

export enum Direction {
    default = 0,
    ascending = 1,
    descending = -1
}

export interface AITableView {
    id: string;
    name: string;
    emoji_icon?: string;
    isActive?: boolean;
    rowHeight?: RowHeight;
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

export enum ViewActionName {
    setView = 'set_view'
}

export interface AIViewAction {
    type: ViewActionName.setView;
    view: Partial<AITableView>;
    newView: Partial<AITableView>;
    path: [number];
}

export interface AIViewTable extends AITable {
    views: WritableSignal<AITableView[]>;
    viewApply: (action: AIViewAction) => void;
}
