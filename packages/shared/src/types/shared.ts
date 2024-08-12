import { AITableField, AITableRecord } from '@ai-table/grid';
import * as Y from 'yjs';

export type SyncMapElement = Y.Map<any>;

export type SyncArrayElement = Y.Array<Y.Array<any>>;

export type SyncElement = Y.Array<SyncMapElement | SyncArrayElement>;

export type SharedType = Y.Map<SyncElement>;

export class Positions {
    [view_id: string]: number;
}

export interface AITableSharedRecord extends AITableRecord {
    positions: Positions;
}

export interface AITableSharedField extends AITableField {
    positions: Positions;
}

export type AITableSharedRecords = AITableSharedRecord[];


export type AITableSharedFields = AITableSharedField[];