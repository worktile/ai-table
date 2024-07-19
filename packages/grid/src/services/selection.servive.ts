import { Injectable, WritableSignal, signal } from '@angular/core';
import { AITableSelection } from '../types';

@Injectable()
export class AITableGridSelectionService {
    selection: WritableSignal<AITableSelection> = signal({
        selectedRecords: new Map(),
        selectedFields: new Map(),
        selectedCells: new Map()
    });

    clearSelection() {
        this.selection.set({
            selectedRecords: new Map(),
            selectedFields: new Map(),
            selectedCells: new Map()
        });
    }

    selectCell(recordId: string, fieldId: string) {
        this.clearSelection();
        this.selection().selectedCells.set(recordId, { [fieldId]: true });
    }

    selectCol(fieldId: string) {
        this.clearSelection();
        this.selection().selectedFields.set(fieldId, true);
    }

    selectRow(recordId: string) {
        if (this.selection().selectedRecords.has(recordId)) {
            this.selection().selectedRecords.delete(recordId);
        } else {
            this.selection().selectedRecords.set(recordId, true);
        }
        this.selection.set({
            selectedRecords: this.selection().selectedRecords,
            selectedFields: new Map(),
            selectedCells: new Map()
        });
    }
}
