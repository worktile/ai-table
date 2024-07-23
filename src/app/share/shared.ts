import { AITableFields, AITableRecords } from '@ai-table/grid';
import { isArray, isNumber, isObject } from 'ngx-tethys/util';
import * as Y from 'yjs';

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
    fieldSharedType.insert(0, data.fields.map(toSyncElement));
    sharedType.set('fields', fieldSharedType);

    const recordSharedType = new Y.Array();
    recordSharedType.insert(0, data.records.map(toRecordSyncElement));
    sharedType.set('records', recordSharedType);
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
            // Handle the issue of numbers being converted to empty strings
            if (isNumber(node[key])) {
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
            // To save memory, convert map to array.
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
