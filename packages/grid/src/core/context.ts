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
        const newPosition = { ...oldPosition, ...position };
        this.pointPosition.set(newPosition);
    }
}
