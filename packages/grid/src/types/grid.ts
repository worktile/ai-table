import { Dictionary } from 'ngx-tethys/types';
import { AITableField, AITableFieldType, AITableRecord } from '../core';
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
    activeCell?: AITableGridCell;
    ranges?: AITableGridRange[];
    recordRanges?: AITableGridRecordRanges;
    fieldRanges?: AITableGridFieldRanges;
    fillHandleStatus?: AITableGridFillHandleStatus;
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

export interface AITableGridCell {
    /**
     * cell row UUID
     */
    recordId: string;
    /**
     * cell column UUID
     */
    fieldId: string;
}

export interface AITableGridRange {
    start: AITableGridCell;
    end: AITableGridCell;
}

export interface AITabelGridIndexRange {
    record: {
        min: number;
        max: number;
    };
    field: {
        min: number;
        max: number;
    };
}

export type AITableGridRecordRanges = string[];

export type AITableGridFieldRanges = string[];

export enum AITableGridFillDirection {
    Left = 'left',
    Right = 'right',
    Below = 'below',
    Top = 'top'
}

export interface AITableGridFillHandleStatus {
    isActive: boolean;
    direction?: AITableGridFillDirection;
    fillRange?: AITableGridRange;
}
