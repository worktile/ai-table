import { WritableSignal } from '@angular/core';
import { AITableAction } from './action';

export enum AITableFieldType {
    // NotSupport = 0,
    Text = 1,
    // Number = 2,
    SingleSelect = 3
    // MultiSelect = 4,
    // DateTime = 5,
    // Attachment = 6,
    // Link = 7,
    // Email = 9,
    // Phone = 10,
    // Checkbox = 11,
    // Rating = 12,
    // Member = 13,
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
    id: string;
    name: string;
    color?: string;
}

export interface AITableField {
    id: string;
    name: string;
    type: AITableFieldType;
    width?: string;
    hidden?: boolean;
    frozen?: boolean;
    statType?: AITableStatType;
    [key: string]: AITableSelectOption[] | any;
}

export interface AITableRecord {
    id: string;
    value: Record<string, any>;
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
    onChange: () => void;
    apply: (action: AITableAction) => void;
}

export interface AITableChangeOptions{
    records: AITableRecord[];
    fields: AITableField[];
    actions: AITableAction[];
}
