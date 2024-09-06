import { AITableContext, AITablePointPosition, AITableLinearRow, AITableScrollState } from '../types';
import { Signal, WritableSignal } from '@angular/core';

export class Context {
    linearRows: Signal<AITableLinearRow[]>;
    pointPosition: WritableSignal<AITablePointPosition>;
    scrollState: WritableSignal<AITableScrollState>;
    constructor({ linearRows, pointPosition, scrollState }: AITableContext) {
        this.linearRows = linearRows;
        this.pointPosition = pointPosition;
        this.scrollState = scrollState;
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
}
