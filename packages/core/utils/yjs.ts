import * as Y from "yjs";
import { toSharedType } from "./convert";
import { WebsocketProvider } from "y-websocket";
import { WritableSignal } from "@angular/core";

export const getSharedType = (
    initializeValue: any,
    isInitializeSharedType: boolean
) => {
    const doc = new Y.Doc();
    const sharedType = doc.getArray<any>("v-table");
    if (!isInitializeSharedType) {
        toSharedType(sharedType, initializeValue as any);
    }
    return sharedType;
};

export const connectProvider = (doc: Y.Doc) => {
    const provider = new WebsocketProvider(
        "wss://demos.yjs.dev/ws",
        "demo-2024/1",
        doc
    );
    if (provider.shouldConnect) {
        provider.connect();
    }
    return provider;
};

const IS_LOCAL: WeakSet<any> = new WeakSet();
const IS_REMOTE: WeakSet<any> = new WeakSet();
const IS_UNDO: WeakSet<any> = new WeakSet();

export interface YjsVTable {
    isLocal: () => boolean;
    asLocal: () => void;
}

export const YjsVTable = {
    isLocal: (signal: WritableSignal<any>): boolean => {
        return IS_LOCAL.has(signal);
    },

    asLocal: (signal: WritableSignal<any>, fn: () => void): void => {
        const wasLocal = YjsVTable.isLocal(signal);
        IS_LOCAL.add(signal);

        fn();

        if (!wasLocal) {
            IS_LOCAL.delete(signal);
        }
    },

    isRemote: (signal: WritableSignal<any>): boolean => {
        return IS_REMOTE.has(signal);
    },

    asRemote: (signal: WritableSignal<any>, fn: () => void): void => {
        const wasRemote = YjsVTable.isRemote(signal);
        IS_REMOTE.add(signal);

        fn();

        if (!wasRemote) {
            Promise.resolve().then(() => IS_REMOTE.delete(signal));
        }
    },

    isUndo: (signal: WritableSignal<any>): boolean => {
        return IS_UNDO.has(signal);
    },

    asUndo: (signal: WritableSignal<any>, fn: () => void): void => {
        const wasUndo = YjsVTable.isUndo(signal);
        IS_UNDO.add(signal);

        fn();

        if (!wasUndo) {
            Promise.resolve().then(() => IS_UNDO.delete(signal));
        }
    }
};
