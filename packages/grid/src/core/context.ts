import { Signal, WritableSignal } from '@angular/core';
import { AITableContext, AITableLinearRow, AITablePointPosition, AITableScrollState, ScrollActionOptions } from '../types';

export class RendererContext {
    linearRows: Signal<AITableLinearRow[]>;
    pointPosition: WritableSignal<AITablePointPosition>;
    scrollState: WritableSignal<AITableScrollState>;
    visibleColumnsMap: Signal<Map<string, number>>;
    visibleRowsIndexMap: Signal<Map<string, number>>;
    scrollAction: (options: ScrollActionOptions) => void;

    constructor(options: AITableContext) {
        const { linearRows, pointPosition, scrollState, visibleColumnsMap, visibleRowsIndexMap, scrollAction } = options;
        this.linearRows = linearRows;
        this.pointPosition = pointPosition;
        this.scrollState = scrollState;
        this.scrollAction = scrollAction;
        this.visibleColumnsMap = visibleColumnsMap;
        this.visibleRowsIndexMap = visibleRowsIndexMap;
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
