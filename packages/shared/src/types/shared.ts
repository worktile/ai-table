import * as Y from 'yjs';

export type SyncMapElement = Y.Map<any>;

export type SyncArrayElement = Y.Array<Y.Array<any>>;

export type SyncElement = Y.Array<SyncMapElement | SyncArrayElement>;

export type SharedType = Y.Map<SyncElement>;