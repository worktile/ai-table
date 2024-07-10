import { WritableSignal } from '@angular/core';
import { VTableAction } from './action';

export enum VTableFieldType {
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

export enum VTableStatType {
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

export interface VTableSelectOption {
    id: string;
    name: string;
    color?: string;
}

export interface VTableField {
    id: string;
    name: string;
    type: VTableFieldType;
    width?: string;
    hidden?: boolean;
    frozen?: boolean;
    statType?: VTableStatType;
    [key: string]: VTableSelectOption[] | any;
}

export interface VTableRecord {
    id: string;
    value: Record<string, any>;
}

export type VTableRecords = VTableRecord[];

export type VTableFields = VTableField[];

export interface VTableValue {
    records: VTableRecords;
    fields: VTableFields;
}

export interface VTable {
    records: WritableSignal<VTableRecords>;
    fields: WritableSignal<VTableFields>;
    actions: VTableAction[];
    onChange: () => void;
    apply: (action: VTableAction) => void;
}

export interface VTableChangeOptions{
    records: VTableRecord[];
    fields: VTableField[];
    actions: VTableAction[];
}
