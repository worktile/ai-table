import { Injectable, signal, WritableSignal } from '@angular/core';
import { UndoManager } from 'yjs';
import { AIViewTable } from '../types';
import { YjsAITable } from './yjs-table';
import { SharedType } from '@ai-table/utils';

@Injectable()
export class UndoManagerService {
    private _undoManager: UndoManager | null = null;
    private _canUndoCount: WritableSignal<number> = signal<number>(0);
    private _canRedoCount: WritableSignal<number> = signal<number>(0);
    private _aiTable: AIViewTable | null = null;

    get undoManager(): UndoManager | null {
        return this._undoManager;
    }

    get canUndoCount(): WritableSignal<number> {
        return this._canUndoCount;
    }

    get canRedoCount(): WritableSignal<number> {
        return this._canRedoCount;
    }

    initialize(sharedType: SharedType, aiTable: AIViewTable) {
        if (!sharedType || !aiTable) {
            return;
        }
        this._aiTable = aiTable;
        this._undoManager = new UndoManager(sharedType, {
            trackedOrigins: new Set([aiTable]),
            captureTimeout: 300
        });

        this._undoManager.on('stack-item-added', () => {
            this._canUndoCount.set(this._undoManager!.undoStack.length);
            this._canRedoCount.set(this._undoManager!.redoStack.length);
        });

        this._undoManager.on('stack-item-popped', () => {
            this._canUndoCount.set(this._undoManager!.undoStack.length);
            this._canRedoCount.set(this._undoManager!.redoStack.length);
        });
    }

    undo() {
        if (this._undoManager?.canUndo()) {
            YjsAITable.asUndo(this._aiTable!, () => this._undoManager!.undo());
        }
    }

    redo() {
        if (this._undoManager?.canRedo()) {
            YjsAITable.asUndo(this._aiTable!, () => this._undoManager!.redo());
        }
    }

    destroy() {
        this._undoManager = null;
        this._canUndoCount.set(0);
        this._canRedoCount.set(0);
    }
}
