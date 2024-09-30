import { AITable } from '@ai-table/grid';

const IS_LOCAL: WeakSet<any> = new WeakSet();
const IS_REMOTE: WeakSet<any> = new WeakSet();
const IS_UNDO: WeakSet<any> = new WeakSet();

export interface YjsAITable {
    isLocal: () => boolean;
    asLocal: () => void;
}

export const YjsAITable = {
    isLocal: (aiTable: AITable): boolean => {
        return IS_LOCAL.has(aiTable);
    },

    asLocal: (aiTable: AITable, fn: () => void): void => {
        const wasLocal = YjsAITable.isLocal(aiTable);
        IS_LOCAL.add(aiTable);

        fn();

        if (!wasLocal) {
            IS_LOCAL.delete(aiTable);
        }
    },

    isRemote: (aiTable: AITable): boolean => {
        return IS_REMOTE.has(aiTable);
    },

    asRemote: (aiTable: AITable, fn: () => void): void => {
        const wasRemote = YjsAITable.isRemote(aiTable);
        IS_REMOTE.add(aiTable);

        fn();

        if (!wasRemote) {
            Promise.resolve().then(() => IS_REMOTE.delete(aiTable));
        }
    },

    isUndo: (aiTable: AITable): boolean => {
        return IS_UNDO.has(aiTable);
    },

    asUndo: (aiTable: AITable, fn: () => void): void => {
        const wasUndo = YjsAITable.isUndo(aiTable);
        IS_UNDO.add(aiTable);

        fn();

        if (!wasUndo) {
            Promise.resolve().then(() => IS_UNDO.delete(aiTable));
        }
    }
};
