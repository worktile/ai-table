import { Signal, WritableSignal } from '@angular/core';
import { AITableContext, AITableEditPosition, AITableLinearRow, AITablePointPosition, AITableScrollState } from '../types';
import { AITable } from './types';

export class Context {
    linearRows: Signal<AITableLinearRow[]>;
    linearRowsIndexMap?: Map<string, number>;
    pointPosition: WritableSignal<AITablePointPosition>;
    scrollState: WritableSignal<AITableScrollState>;
    toggleEditing: (options: { aiTable: AITable; recordId: string; fieldId: string; position: AITableEditPosition }) => void = () => {};

    constructor(options: AITableContext) {
        const { linearRows, pointPosition, scrollState, toggleEditing } = options;
        this.linearRows = linearRows;
        this.linearRowsIndexMap = new Map(linearRows().map((row, index) => [row._id, index]));
        this.pointPosition = pointPosition;
        this.scrollState = scrollState;
        if (toggleEditing) {
            this.toggleEditing = toggleEditing;
        }
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
