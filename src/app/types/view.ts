import { AITable } from '@ai-table/grid';
import { Direction } from '@angular/cdk/bidi';

export enum RowHeight {
    short = 'short',
    medium = 'medium',
    tall = 'tall'
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
    updateRowHeight = 'update_row_height'
}

export interface AIViewAction {
    type: ViewActionName.updateRowHeight;
    view: AITableView;
    key: string;
    value: any;
}

export interface AIViewTable extends AITable {
    viewApply: (action: AIViewAction) => void;
}
