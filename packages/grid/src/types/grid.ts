import { Signal, ViewContainerRef, WritableSignal } from '@angular/core';

import { AITableFieldMenuItem } from './field';
import { AITableLinearRow } from './row';
import {
    AITableField,
    AITableRecord,
    FieldValue,
    AITableFields,
    AIRecordFieldIdPath,
    AITableFieldType,
    UpdateFieldValueOptions,
    AITableReferences,
    AddRecordOptions,
    AITableFieldOption
} from '@ai-table/utils';
import { AITable, Coordinate } from '../core';
import { AITableRender } from './cell';
import { Drawer } from '../renderer/drawers/drawer';
import { FieldOperable } from '../utils';
import { CellDrawer } from '../renderer/drawers/cell-drawer';
import { Constructor } from 'ngx-tethys/core';
import { HoverCellComponent } from '../renderer';

export interface AITableGridCellRenderSchema<TR extends AITableReferences = AITableReferences> {
    editor?: any;
    transform?: (field: AITableField, value: FieldValue) => any;
}

export interface AITableContent {
    records: Partial<AITableRecord>[];
    fields: AITableFields;
}

export interface AITableGridData extends AITableContent {
    type: 'grid';
}

export interface AITableSelection {
    selectedRecords: Set<string>; // `${recordId}`
    selectedFields: Set<string>; // `${fieldId}`
    selectedCells: Set<string>; // `${recordId}:${fieldId}`
    activeCell: AIRecordFieldIdPath | null;
    selectAllState: AITableSelectAllState; // 'all','partial','none'
}

export interface AITableCustomFieldConfig<TR extends AITableReferences = AITableReferences> {
    fieldOption?: AITableFieldOption;
    fieldModel?: FieldOperable<unknown, unknown>;
    render?: (render: AITableRender<TR>, drawer: CellDrawer) => any;
    hoverRender?: Constructor<HoverCellComponent>;
    getDefaultFieldValue?: (field: AITableField) => FieldValue;
}

export interface AIFieldConfig<TR extends AITableReferences = AITableReferences> {
    hiddenIndexColumn?: boolean;
    fieldRenderers?: Partial<Record<AITableFieldType | string, AITableGridCellRenderSchema<TR>>>;
    fieldSettingComponent?: any;
    fieldMenus?: (aiTable: AITable) => AITableFieldMenuItem[];
    customFields?: Partial<Record<string, AITableCustomFieldConfig<TR>>>;
}

export interface AITableRendererConfig {
    aiTable: AITable;
    container: HTMLDivElement;
    coordinate: Coordinate;
    containerWidth: number;
    containerHeight: number;
    references: AITableReferences;
    readonly: boolean;
    rowDragDisabled: boolean;
    maxFields?: number;
    maxRecords?: number;
    actions: {
        updateFieldValue: (options: UpdateFieldValueOptions) => void;
        addRecord: (options: AddRecordOptions) => void;
    };
}

export enum AITableCheckType {
    checked = 'checked',
    unchecked = 'unchecked'
}

export interface AITableScrollState {
    scrollTop: number;
    scrollLeft: number;
    isScrolling: boolean;
}

export interface ScrollActionOptions {
    deltaX: number;
    deltaY: number;
    shiftKey: boolean;
    callback?: () => void;
}

export enum AITableAreaType {
    grid = 'grid',
    none = 'none'
}

export type AITablePointPosition = {
    x: number;
    y: number;
    areaType: AITableAreaType;
    targetName: string;
    realTargetName: string;
    rowIndex: number;
    columnIndex: number;
    offsetTop: number;
    offsetLeft: number;
};

export interface AITableEditPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface AITableOpenEditOptions {
    recordId: string;
    fieldId: string;
    coordinate: Coordinate;
    references: AITableReferences;
    container?: HTMLDivElement;
    isHoverEdit?: boolean;
    viewContainerRef?: ViewContainerRef;
    updateFieldValue: (options: UpdateFieldValueOptions<any>) => void;
}

export interface AITableContext {
    rowHeadWidth: Signal<number>;
    linearRows: Signal<AITableLinearRow[]>;
    pointPosition: WritableSignal<AITablePointPosition>;
    scrollState: WritableSignal<AITableScrollState>;
    scrollAction: (options: ScrollActionOptions) => void;
    visibleColumnsIndexMap: Signal<Map<string, number>>;
    visibleRowsIndexMap: Signal<Map<string, number>>;
    frozenColumnCount: Signal<number>;
    references: Signal<AITableReferences>;
    aiFieldConfig: Signal<AIFieldConfig | undefined>;
    maxFields: Signal<number | undefined>;
    maxRecords: Signal<number | undefined>;
}

export enum AITableSelectAllState {
    all = 'all',
    partial = 'partial',
    none = 'none'
}
