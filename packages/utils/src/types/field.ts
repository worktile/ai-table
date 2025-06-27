import { AITableField, AITableRecords, AITableStatType } from './core';

export interface FieldOptions {
    aiTable?: any;
    field?: AITableField;
}

export type AITableFieldStatType = AITableStatType | string;

export interface AITableFieldStatTypeItemInfo {
    name: string;
    type: AITableFieldStatType;
    i18nKey?: string;
    exec: (records: AITableRecords, field: AITableField) => any;
    format: string;
}
