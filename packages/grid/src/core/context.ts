import { Signal, WritableSignal } from '@angular/core';
import { AIFieldConfig, AITableContext, AITableLinearRow, AITablePointPosition, AITableScrollState, ScrollActionOptions } from '../types';
import { AITableFieldOption, AITableReferences } from '@ai-table/utils';

export class RendererContext {
    rowHeadWidth: Signal<number>;
    linearRows: Signal<AITableLinearRow[]>;
    pointPosition: WritableSignal<AITablePointPosition>;
    scrollState: WritableSignal<AITableScrollState>;
    visibleColumnsIndexMap: Signal<Map<string, number>>;
    visibleRowsIndexMap: Signal<Map<string, number>>;
    frozenColumnCount: Signal<number>;
    references: Signal<AITableReferences>;
    aiFieldConfig: Signal<AIFieldConfig | undefined>;
    scrollAction: (options: ScrollActionOptions) => void;
    maxFields: Signal<number | undefined>;
    maxRecords: Signal<number | undefined>;
    fieldOptions: Signal<AITableFieldOption[]>;
    fieldOptionMap: Signal<Map<string, AITableFieldOption>>;

    constructor(options: AITableContext) {
        const {
            rowHeadWidth,
            linearRows,
            pointPosition,
            scrollState,
            visibleColumnsIndexMap,
            visibleRowsIndexMap,
            frozenColumnCount,
            references,
            aiFieldConfig,
            scrollAction,
            maxFields,
            maxRecords,
            fieldOptions,
            fieldOptionMap
        } = options;
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
        this.fieldOptions = fieldOptions;
        this.fieldOptionMap = fieldOptionMap;
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
