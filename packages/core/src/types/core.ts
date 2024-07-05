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

export enum VTableViewType {
    Grid = 1
    // Kanban = 2,
    // Gallery = 3,
    // Form = 4,
    // Calendar = 5,
    // Gantt = 6,
    // OrgChart = 7,
}

export enum VTableOrderType {
    DESC = 0,
    ASC = 1
}

export enum VTableConditionType {
    OR = 0,
    AND = 1
}

export interface SelectOption {
    id: string;
    name: string;
    color?: string;
}

export interface VTableOption {
    groupInfo?: {
        fieldId: string;
        order: VTableOrderType;
    }[];
    sort?: {
        fieldId: string;
        order: VTableOrderType;
    }[];
    filter?: {
        condition: VTableConditionType;
        operation: {
            fieldId: string;
            option: any;
            value: any;
        }[];
    };
}

export interface VTableField {
    id: string;
    name: string;
    type: VTableFieldType;
    width?: string;
    hidden?: boolean;
    frozen?: boolean;
    statType?: VTableStatType;
    [key: string]: SelectOption[] | any;
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

export interface VTable<T extends VTableOption = VTableOption> {
    records: WritableSignal<VTableRecords>;
    fields: WritableSignal<VTableFields>;
    view: WritableSignal<T>;
    actions: VTableAction[];
    apply: (action: VTableAction) => void;
    applyFields: (action: VTableAction) => void;
    applyRecords: (action: VTableAction) => void;
    applyView: (action: VTableAction) => void;
}

export interface VTableContextChangeOptions<T> {
    records: VTableRecord[];
    fields: VTableField[];
    view: T;
    actions: VTableAction[];
}
