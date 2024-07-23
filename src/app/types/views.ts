import { Direction } from '@angular/cdk/bidi';
import { SafeAny } from 'ngx-tethys/types';

export enum CustomActionName {
    updateRowHeight = 'update_row_height'
}

export interface RowHeight {
    id: 'short' | 'medium' | 'tall';
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
