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
    AITableFieldOption
} from '@ai-table/utils';
import { AITable, Coordinate } from '../core';
import { AITableRender } from './cell';
import { AITableActions, FieldOperable } from '../utils';
import { CellDrawer } from '../renderer/drawers/cell-drawer';
import { Constructor } from 'ngx-tethys/core';
import { CoverCellBase } from '../renderer';

export interface AITableGridCellRenderSchema<TR extends AITableReferences = AITableReferences> {
    editor?: any;
    toText?: (field: AITableField, value: FieldValue) => any;
    toFieldValue?: (text: string, value: FieldValue) => any;
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
    selectedEndCell: AIRecordFieldIdPath | null;
}

export interface AITableCustomFieldConfig<TR extends AITableReferences = AITableReferences> {
    fieldOption?: AITableFieldOption;
    fieldModel?: FieldOperable<unknown, unknown>;
    render?: (render: AITableRender<TR>, drawer: CellDrawer) => any;
    coverRender?: Constructor<CoverCellBase>;
}

export interface AIFieldConfig<TR extends AITableReferences = AITableReferences> {
    hiddenIndexColumn?: boolean;
    hiddenRowDrag?: boolean;
    fieldRenderers?: Partial<Record<AITableFieldType | string, AITableGridCellRenderSchema<TR>>>;
    fieldSettingComponent?: any;
    fieldMenus?: (aiTable: AITable) => AITableFieldMenuItem[];
    customFields?: Partial<Record<string, AITableCustomFieldConfig<TR>>>;
    filterFieldOptions?: (fieldOptions: AITableFieldOption[]) => AITableFieldOption[];
}

export interface AITableRendererConfig {
    aiTable: AITable;
    container: HTMLDivElement;
    coordinate: Coordinate;
    containerWidth: number;
    containerHeight: number;
    references: AITableReferences;
    readonly: boolean;
    maxFields?: number;
    maxRecords?: number;
    actions: AITableActions;
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
    viewContainerRef?: ViewContainerRef;
    isSelectAll?: boolean;
    updateFieldValues: (options: UpdateFieldValueOptions[]) => void;
}

export interface AITableContext {
    containerRect: Signal<{ width: number; height: number }>;
    rowHeadWidth: Signal<number>;
    linearRows: Signal<AITableLinearRow[]>;
    pointPosition: WritableSignal<AITablePointPosition>;
    scrollState: WritableSignal<AITableScrollState>;
    scrollAction: (options: ScrollActionOptions) => void;
    visibleColumnsIndexMap: Signal<Map<string, number>>;
    visibleRowsIndexMap: Signal<Map<string, number>>;
    groupStatContainerWidthMap: WritableSignal<Map<string, number>>;
    frozenColumnCount: Signal<number>;
    references: Signal<AITableReferences>;
    aiFieldConfig: Signal<AIFieldConfig | undefined>;
    maxFields: Signal<number | undefined>;
    maxRecords: Signal<number | undefined>;
    maxSelectOptions: Signal<number | undefined>;
    fieldOptions: Signal<AITableFieldOption[]>;
    fieldOptionMap: Signal<Map<string, AITableFieldOption>>;
    collapseDisabled: WritableSignal<boolean>;
    readonly?: Signal<boolean>;
}

export enum AITableSelectAllState {
    all = 'all',
    partial = 'partial',
    none = 'none'
}
