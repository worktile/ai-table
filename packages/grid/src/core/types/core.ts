import { WritableSignal } from '@angular/core';
import { Id } from 'ngx-tethys/types';
import { AITableSelection } from '../../types';
import { AITableAction } from './action';

export enum AITableFieldType {
    text = 'text', // 包含多行文本
    richText = 'rich_text', // 包含多行文本
    select = 'select', // 包含单选和多选
    number = 'number',
    date = 'date',
    member = 'member', // 包含单个和多个
    // cascadeSelect = 'cascade_select', // 包含单选和多选，参数复杂后续再进行设计
    progress = 'progress',
    rate = 'rate',
    link = 'link',
    createdAt = 'created_at',
    updatedAt= 'updated_at'
}

export enum AITableStatType {
    None = 0,
    CountAll = 1,
    Empty = 2,
    Filled = 3,
    Unique = 4,
    PercentEmpty = 5,
    PercentFilled = 6,
    PercentUnique = 7,
    Sum = 8,
    Average = 9,
    Max = 10,
    Min = 11,
    DateRangeOfDays = 12,
    DateRangeOfMonths = 13,
    Checked = 14,
    UnChecked = 15,
    PercentChecked = 16,
    PercentUnChecked = 17
}

export interface AITableSelectOption {
    _id: string;
    text: string;
    color?: string;
    bg_color?: string;
    [key: string]: any;
}

export interface AITableField<T = unknown> {
    _id: string;
    name: string;
    type: AITableFieldType;
    icon?: string;
    width?: number;
    hidden?: boolean;
    frozen?: boolean;
    statType?: AITableStatType;
    readonly?: boolean;
    isMultiple?: boolean;
    [key: string]: T | any;
}

export type TextFieldValue = string;

export type SelectFieldValue = Id[]; // 数字

export type NumberFieldValue = number;

export type DateFieldValue = { timestamp: number }; // 时间戳

export type MemberFieldValue = Id[];

export type ProgressFieldValue = number; // [0,1]

export type RateFieldValue = 1 | 2 | 3 | 4 | 5;

export type FieldValue =
    | TextFieldValue
    | SelectFieldValue
    | NumberFieldValue
    | DateFieldValue
    | MemberFieldValue
    | ProgressFieldValue
    | RateFieldValue
    | any;

export interface AITableRecord {
    _id: string;
    checked?: boolean;
    values: Record<string, FieldValue>;
}

export type AITableRecords = AITableRecord[];

export type AITableFields = AITableField[];

export interface AITableValue {
    records: AITableRecords;
    fields: AITableFields;
}

export interface AITable {
    records: WritableSignal<AITableRecords>;
    fields: WritableSignal<AITableFields>;
    actions: AITableAction[];
    selection: WritableSignal<AITableSelection>;
    onChange: () => void;
    apply: (action: AITableAction) => void;
}

export interface AITableChangeOptions {
    records: AITableRecord[];
    fields: AITableField[];
    actions: AITableAction[];
}

export interface AITableFieldInfo {
    type: AITableFieldType;
    name: string;
    icon: string;
    width: number;
}

export type AIPlugin = (aiTable: AITable) => AITable;
