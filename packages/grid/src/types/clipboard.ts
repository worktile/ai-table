import { AITableField, FieldValue } from '../core';

export interface ClipboardData {
    text?: string;
    html?: string;
}

export interface AITableCellContent {
    field: AITableField;
    cellValue: FieldValue;
    cellFullText: string;
}
