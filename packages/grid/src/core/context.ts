import { Signal, WritableSignal } from '@angular/core';
import {
    AIFieldConfig,
    AITableContext,
    AITableLinearRow,
    AITablePointPosition,
    AITableReferences,
    AITableScrollState,
    ScrollActionOptions
} from '../types';

export class RendererContext {
    linearRows: Signal<AITableLinearRow[]>;
    pointPosition: WritableSignal<AITablePointPosition>;
    scrollState: WritableSignal<AITableScrollState>;
    visibleColumnsIndexMap: Signal<Map<string, number>>;
    visibleRowsIndexMap: Signal<Map<string, number>>;
    frozenColumnCount: Signal<number>;
    references: Signal<AITableReferences>;
    aiFieldConfig: Signal<AIFieldConfig | undefined>;
    scrollAction: (options: ScrollActionOptions) => void;
    notDisplayed: WritableSignal<[string?, string?]>;

    constructor(options: AITableContext) {
        const {
            linearRows,
            pointPosition,
            scrollState,
            visibleColumnsIndexMap,
            visibleRowsIndexMap,
            frozenColumnCount,
            references,
            aiFieldConfig,
            notDisplayed,
            scrollAction
        } = options;
        this.linearRows = linearRows;
        this.pointPosition = pointPosition;
        this.scrollState = scrollState;
        this.scrollAction = scrollAction;
        this.visibleColumnsIndexMap = visibleColumnsIndexMap;
        this.visibleRowsIndexMap = visibleRowsIndexMap;
        this.frozenColumnCount = frozenColumnCount;
        this.references = references;
        this.aiFieldConfig = aiFieldConfig;
        this.notDisplayed = notDisplayed;
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

    setNotDisplayed(position: [string?, string?] = [undefined, undefined]) {
        this.notDisplayed.set(position);
    }
}
