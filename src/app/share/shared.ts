import { AITableFields, AITableRecords } from '@ai-table/grid';
import { isArray, isObject } from 'ngx-tethys/util';
import * as Y from 'yjs';
import { connectProvider } from './provider';

export type SyncMapElement = Y.Map<any>;
export type SyncArrayElement = Y.Array<SyncMapElement>;
export type SharedType = Y.Map<SyncArrayElement>;

export const getSharedType = (
    initializeValue: {
        fields: AITableFields;
        records: AITableRecords;
    },
    isInitializeSharedType: boolean
) => {
    const doc = new Y.Doc();
    const sharedType = doc.getMap<any>('ai-table');
    if (!isInitializeSharedType) {
        toSharedType(sharedType, initializeValue);
    }
    return sharedType;
};

export function toSharedType(
    sharedType: Y.Map<any>,
    data: {
        fields: AITableFields;
        records: AITableRecords;
    }
): void {
    const fieldSharedType = new Y.Array();
    sharedType.set('fields', fieldSharedType);
    fieldSharedType.insert(0, data.fields.map(toSyncElement));

    const recordSharedType = new Y.Array();
    sharedType.set('records', recordSharedType);
    recordSharedType.insert(0, data.records.map(toRecordSyncElement));
}

export function toSyncElement(node: any): SyncMapElement {
    const element: SyncMapElement = new Y.Map();
    for (const key in node) {
        if (isArray(node[key])) {
            const arrayElement = new Y.Array();
            const arrayContainer = node[key].map(toSyncElement);
            arrayElement.insert(0, arrayContainer);
            element.set(key, arrayElement);
        }
        if (isObject(node[key])) {
            const mapElement = toSyncElement(node[key]);
            element.set(key, mapElement);
        } else {
            let textElement = new Y.Text(node[key]);
            if (key === 'type') {
                textElement = new Y.Text(node[key].toString());
            }
            element.set(key, textElement);
        }
    }
    return element;
}

export function toRecordSyncElement(node: any) {
    const element = new Y.Map();
    for (const key in node) {
        if (key === 'value') {
            const arrayElement: SyncArrayElement = new Y.Array();
            const recordArray: { id: string; fieldValue: any }[] = [];
            for (const fieldId in node[key]) {
                recordArray.push({
                    id: fieldId,
                    fieldValue: node[key][fieldId]
                });
            }
            element.set(key, arrayElement);
            arrayElement.insert(0, recordArray.map(toSyncElement));
        } else {
            const textElement = new Y.Text(node[key]);
            element.set(key, textElement);
        }
    }

    return element;
}
