import { Signal, WritableSignal } from '@angular/core';
import { AIFieldConfig, AITableContext, AITableLinearRow, AITablePointPosition, AITableScrollState, ScrollActionOptions } from '../types';
import { AITableFieldOption, AITableReferences } from '@ai-table/utils';

export class RendererContext {
    containerRect: Signal<{ width: number; height: number }>;
    rowHeadWidth: Signal<number>;
    linearRows: Signal<AITableLinearRow[]>;
    pointPosition: WritableSignal<AITablePointPosition>;
    scrollState: WritableSignal<AITableScrollState>;
    visibleColumnsIndexMap: Signal<Map<string, number>>;
    visibleRowsIndexMap: Signal<Map<string, number>>;
    groupStatContainerWidthMap: WritableSignal<Map<string, number>>;
    frozenColumnCount: Signal<number>;
    references: Signal<AITableReferences>;
    aiFieldConfig: Signal<AIFieldConfig | undefined>;
    scrollAction: (options: ScrollActionOptions) => void;
    maxFields: Signal<number | undefined>;
    maxRecords: Signal<number | undefined>;
    maxSelectOptions: Signal<number | undefined>;
    fieldOptions: Signal<AITableFieldOption[]>;
    fieldOptionMap: Signal<Map<string, AITableFieldOption>>;
    collapseDisabled: WritableSignal<boolean>;
    readonly?: Signal<boolean>;

    constructor(options: AITableContext) {
        const {
            containerRect,
            rowHeadWidth,
            linearRows,
            pointPosition,
            scrollState,
            visibleColumnsIndexMap,
            visibleRowsIndexMap,
            groupStatContainerWidthMap,
            frozenColumnCount,
            references,
            aiFieldConfig,
            scrollAction,
            maxFields,
            maxRecords,
            maxSelectOptions,
            fieldOptions,
            fieldOptionMap,
            collapseDisabled,
            readonly
        } = options;
        this.containerRect = containerRect;
        this.rowHeadWidth = rowHeadWidth;
        this.linearRows = linearRows;
        this.pointPosition = pointPosition;
        this.scrollState = scrollState;
        this.scrollAction = scrollAction;
        this.visibleColumnsIndexMap = visibleColumnsIndexMap;
        this.visibleRowsIndexMap = visibleRowsIndexMap;
        this.frozenColumnCount = frozenColumnCount;
        this.references = references;
        this.aiFieldConfig = aiFieldConfig;
        this.maxFields = maxFields;
        this.maxRecords = maxRecords;
        this.maxSelectOptions = maxSelectOptions;
        this.fieldOptions = fieldOptions;
        this.fieldOptionMap = fieldOptionMap;
        this.collapseDisabled = collapseDisabled;
        this.readonly = readonly;
        this.groupStatContainerWidthMap = groupStatContainerWidthMap;
    }

    setPointPosition(position: Partial<AITablePointPosition>) {
        const oldPosition = this.pointPosition();
        if (
            oldPosition.areaType !== position.areaType ||
            oldPosition.rowIndex !== position.rowIndex ||
            oldPosition.columnIndex !== position.columnIndex ||
            oldPosition.targetName !== position.targetName
        ) {
            const newPosition = { ...oldPosition, ...position };
            this.pointPosition.set(newPosition);
        }
    }

    setScrollState(scrollState: Partial<AITableScrollState>) {
        this.scrollState.set({ ...this.scrollState(), ...scrollState });
    }
}
