import { Dictionary } from 'ngx-tethys/types';
import { AITableField, AITableFieldType, AITableRecord } from '../core';
import { AITableGridCell, AITableGridFieldRanges, AITableGridFillHandleStatus, AITableGridRange, AITableGridRecordRanges } from '../konva';
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
