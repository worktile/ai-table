import { AITableFieldsSizeMap } from './grid';

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

export interface AITableFieldOption {
    name: string;
    type: AITableFieldType | string;
    icon: string;
    width: number;
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
    stat_type?: AITableStatType;
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
}

export enum AITableSelectOptionStyle {
    text = 1,
    tag = 2,
    dot = 3,
    piece = 4
}

export type TextFieldValue = string | null;

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

export interface MoveRecordOptions {
    recordIds: IdPath[];
    newPath: NumberPath;
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
    width?: number;
}

export interface TransactionOriginInfo {
    uid: string;
    [key: string]: any;
}
