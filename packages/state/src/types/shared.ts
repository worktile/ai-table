import * as Y from 'yjs';

export type SyncMapElement = Y.Map<any>;

export type SyncArrayElement = Y.Array<any>;

export type SharedType = Y.Map<Y.Array<SyncMapElement | SyncArrayElement>>;