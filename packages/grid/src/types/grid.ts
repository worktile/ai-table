import { Dictionary } from 'ngx-tethys/types';
import { AITable, AITableField, AITableFieldType, AITableRecord } from '../core';
import { AITableFieldMenuItem } from './field';

export interface AITableGridCellRenderSchema {
    editor: any;
}

export interface AITableGridData {
    type: 'grid';
    fields: AITableField[];
    records: AITableRecord[];
}

export interface AITableSelection {
    selectedRecords: Map<string, boolean>;
    selectedFields: Map<string, boolean>;
    selectedCells: Map<string, {}>;
}

export interface AIFieldConfig {
    fieldRenderers?: Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>;
    fieldPropertyEditor?: any;
    fieldMenus?: AITableFieldMenuItem[];
}

export interface AITableUserInfo {
    uid?: string;
    display_name?: string;
    avatar?: string;
}

export interface AITableReferences {
    members: Dictionary<AITableUserInfo>;
}

export interface AITableGridOptions {
    aiTable: AITable;
    fields: AITableField[];
    records: AITableRecord[];
    container: HTMLDivElement;
    width: number;
    height: number;
}
