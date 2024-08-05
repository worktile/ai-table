import { AITable } from '@ai-table/grid';
import { WritableSignal } from '@angular/core';

export enum Direction {
    default = 0,
    ascending = 1,
    descending = -1
}

export interface AITableView {
    _id: string;
    text: string;
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

export enum ViewActionName {
    setView = 'set_view'
}

export interface SetAIViewAction {
    type: ViewActionName.setView;
    view: Partial<AITableView>;
    newView: Partial<AITableView>;
    path: [number];
}

export type AIViewAction = SetAIViewAction;

export interface AIViewTable extends AITable {
    views: WritableSignal<AITableView[]>;
    viewApply: (action: AIViewAction) => void;
}
