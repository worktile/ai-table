import { AITableSharedView } from "@ai-table/shared";

export enum Direction {
    default = 0,
    ascending = 1,
    descending = -1
}

export interface AITableView extends AITableSharedView{
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