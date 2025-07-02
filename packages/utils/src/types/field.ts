import { AITableField, AITableRecords, AITableStatType } from './core';

export interface FieldOptions {
    aiTable?: any;
    field?: AITableField;
}

export type AITableFieldStatType = AITableStatType | string;

export interface AITableFieldStatTypeItemInfo {
    name: string;
    type: AITableFieldStatType;
    exec: (records: AITableRecords, options: FieldOptions) => any;
    format: string;
}
