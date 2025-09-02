import { Signal } from '@angular/core';
import { AITableFieldsSizeMap } from './grid';
import { AITableFieldStatType } from './field';

export type Id = string;

export enum AITableFieldType {
    text = 'text',
    richText = 'rich_text',
    select = 'select', // 包含单选和多选
    number = 'number',
    date = 'date',
    member = 'member', // 包含单个和多个
    progress = 'progress',
    rate = 'rate',
    link = 'link',
    attachment = 'attachment',
    checkbox = 'checkbox',
    createdAt = 'created_at',
    updatedAt = 'updated_at',
    createdBy = 'created_by',
    updatedBy = 'updated_by'
}

export type SystemFieldTypes =
    | AITableFieldType.createdAt
    | AITableFieldType.createdBy
    | AITableFieldType.updatedAt
    | AITableFieldType.updatedBy;

export enum AITableStatType {
    None = 'none',
    CountAll = 'count_all',
    Empty = 'empty',
    Filled = 'filled',
    Unique = 'unique',
    PercentEmpty = 'percent_empty',
    PercentFilled = 'percent_filled',
    PercentUnique = 'percent_unique',
    Sum = 'sum',
    Average = 'average',
    Max = 'max',
    Min = 'min',
    DateRangeOfDays = 'date_range_of_days',
    DateRangeOfMonths = 'date_range_of_months',
    Checked = 'checked',
    UnChecked = 'unchecked',
    PercentChecked = 'percent_checked',
    PercentUnChecked = 'percent_unchecked',
    EarliestTime = 'earliest_time',
    LatestTime = 'latest_time'
}

export enum AITableFieldGroup {
    base = 'base',
    advanced = 'advanced'
}

export interface AITableFieldOption {
    name: string;
    type: AITableFieldType | string;
    group: AITableFieldGroup;
    icon: string;
    path?: string;
    width: number;
    minWidth?: number;
    settings?: AITableFieldSettings;
}

export interface AITableField {
    _id: string;
    name: string;
    type: AITableFieldType | string;
    icon?: string;
    width?: number;
    hidden?: boolean;
    frozen?: boolean;
    stat_type?: AITableFieldStatType;
    settings?: AITableFieldSettings;
}

export type AITableFieldSettings = TextSettings | RichTextSettings | SelectSettings | MemberSettings | AttachmentSettings;

export interface TextSettings {}

export interface RichTextSettings {}

export interface SelectSettings extends IsMultiple {
    option_style?: AITableSelectOptionStyle;
    options: AITableSelectOption[];
}

export interface AttachmentSettings {}

export interface MemberSettings extends IsMultiple {}

export interface IsMultiple {
    is_multiple?: boolean;
}

export interface AITableSelectOption {
    _id: string;
    text: string;
    icon?: string;
    color?: string;
    bg_color?: string;
    is_disabled?: 0 | 1 | undefined;
}

export enum AITableSelectOptionStyle {
    text = 1,
    tag = 2,
    dot = 3,
    piece = 4
}

export type TextFieldValue = string | null;

export type CheckboxFieldValue = boolean | null;

export type RichTextFieldValue = any[];

export type LinkFieldValue = { url: string; text: string } | null;

export type SelectFieldValue = Id[];

export type NumberFieldValue = number | null;

export type DateFieldValue = { timestamp: number } | null;

export type MemberFieldValue = Id[];

export type AttachmentFieldValue = string[];

export type ProgressFieldValue = number | null; // [0,1]

export type RateFieldValue = 1 | 2 | 3 | 4 | 5 | null;

export type FieldValue =
    | TextFieldValue
    | RichTextFieldValue
    | LinkFieldValue
    | SelectFieldValue
    | NumberFieldValue
    | DateFieldValue
    | MemberFieldValue
    | ProgressFieldValue
    | RateFieldValue
    | AttachmentFieldValue
    | CheckboxFieldValue
    | any;

export interface TrackableEntity {
    created_at: NumberFieldValue;
    created_by: string;
    updated_at: NumberFieldValue;
    updated_by: string;
}

export interface UpdateTrackableEntity {
    updated_at: NumberFieldValue;
    updated_by: string;
}

export interface AITableRecord {
    _id: string;
    short_id: string;
    created_at: NumberFieldValue;
    created_by: string;
    updated_at: NumberFieldValue;
    updated_by: string;
    values: Record<string, FieldValue>;
    [key: string]: any;
}

export interface AITableRecordUpdatedInfo {
    updated_at: number;
    updated_by: string;
}

export interface AITableSystemFieldValueOption {
    path: IdPath;
    updatedInfo: AITableRecordUpdatedInfo;
}

export type AITableRecords = AITableRecord[];

export type AITableFields = AITableField[];

export interface AITableValue {
    records: AITableRecords;
    fields: AITableFields;
    fieldsSizeMap: AITableFieldsSizeMap;
}

export enum Direction {
    before = 'before',
    after = 'after'
}

export interface AddRecordOptions {
    originId?: string;
    isDuplicate?: boolean;
    count?: number;
    targetIndex?: number;
    targetId?: string;
    isInsertBefore?: boolean;
    forGroupId?: string | null;
}

export interface AddFieldOptions {
    defaultValue: Partial<AITableField>;
    direction?: Direction;
    isDuplicate?: boolean;
    originId?: string;
    count?: number;
}

export interface UpdateFieldValueOptions<T = unknown> {
    value: T;
    path: AIRecordFieldIdPath;
}

export interface SetFieldOptions<T = unknown> {
    field: AITableField;
    path: IdPath;
}

export interface MoveFieldOptions {
    path: NumberPath;
    newPath: NumberPath;
}

export interface SetFieldWidthOptions {
    path: IdPath;
    width: number;
}

export interface SetFieldStatTypeOptions {
    path: IdPath;
    statType: AITableFieldStatType;
}

export interface MoveRecordOptions {
    recordIds: IdPath[];
    afterRecordId?: string;
    beforeRecordId?: string;
}

export type NumberPath = [number];

export type IdPath = [string];

export type AIRecordFieldIdPath = [string, string];

export type Path = NumberPath | IdPath | AIRecordFieldIdPath;

export enum DragType {
    record = 'record',
    field = 'field',
    columnWidth = 'columnWidth',
    none = 'none'
}

export interface DragEndData {
    type: DragType;
    targetIndex?: number;
    fieldIds?: Set<string>;
    fieldsIndex?: number[];
    recordIds?: Set<string>;
    recordsIndex?: number[];
    afterRecordId?: string;
    beforeRecordId?: string;
    width?: number;
}

export interface TransactionOriginInfo {
    uid: string;
    [key: string]: any;
}

export interface AITable {
    getI18nTextByKey?: (key: string) => string;
}

export enum DragDirection {
    left = 'left',
    right = 'right',
    top = 'top',
    bottom = 'bottom',
    none = 'none'
}
