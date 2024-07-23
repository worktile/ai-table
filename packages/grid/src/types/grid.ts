import { AITable, AITableField, AITableFields, AITableFieldType, AITableRecord, AITableRecords } from '../core';
import { AITableFieldMenu } from './field';

export enum AITableRowHeight {
    Short = 1,
    Medium = 2,
    Tall = 3,
    ExtraTall = 4
}

export interface AICustomAction {
    [key: string]: (aiTable: AITable, records: AITableRecords, fields: AITableFields, options: any) => void;
}

export interface AITableGridCellRenderSchema {
    editor: any;
}

export interface AITableGridData {
    type: 'grid';
    fields: AITableField[];
    records: AITableRecord[];
}

export interface AIFieldConfig {
    fieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>;
    fieldPropertyEditor?: any;
    fieldMenus?: AITableFieldMenu[];
}


