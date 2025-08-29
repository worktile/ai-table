import { AITableField, AITableRecord, Id } from './core';
import { AITableFieldStatType } from './field';

export class Positions {
    [view_id: string]: number;
}

export class RemovePositions {
    [view_id: string]: undefined;
}

export interface AITableViewRecord extends AITableRecord {
    positions: Positions;
    widths?: Record<Id, number>;
}

export interface AITableViewField extends AITableField {
    positions: Positions;
    widths?: Record<Id, number>;
    fieldStatTypes?: Record<Id, AITableFieldStatType>;
}

export type AITableViewRecords = AITableViewRecord[];

export type AITableViewFields = AITableViewField[];

export enum AITableFilterLogical {
    and = 'and',
    or = 'or'
}

export type ViewSettings = AITableSearchOptions & AITableFilterConditions & AITableSortOptions & AITableFrozenOptions & AITableGroupOptions;

export interface AITableView {
    _id: string;
    short_id: string;
    name: string;
    emoji_icon?: string;
    settings?: ViewSettings;
    position?: number;
    [key: string]: any;
}

export interface AITableFilterConditions<TValue = unknown> {
    condition_logical?: AITableFilterLogical;
    conditions?: AITableFilterCondition<TValue>[];
}

export interface AITableSortOptions {
    is_keep_sort?: boolean;
    sorts?: {
        sort_by: Id;
        direction: SortDirection;
    }[];
}

export interface AITableSearchOptions {
    keywords?: string;
}

export interface AITableFrozenOptions {
    frozen_field_id?: Id;
}

export interface AITableGroupField {
    field_id: Id;
    direction: SortDirection;
}

export interface AITableGroupOptions {
    groups?: AITableGroupField[];
    collapsed_group_ids?: string[]; // 折叠的分组ID列表
}

export type AITableViews = AITableView[];

export enum AITableFilterOperation {
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

export interface AITableFilterCondition<TValue = unknown> {
    field_id: Id;
    operation: AITableFilterOperation;
    value: TValue;
}

export enum SortDirection {
    default = 0,
    ascending = 1,
    descending = -1
}
