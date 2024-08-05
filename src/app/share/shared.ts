import { isArray, isObject } from 'ngx-tethys/util';
import * as Y from 'yjs';
import { DemoAIField, DemoAIRecord, Positions } from '../types';

export type SyncMapElement = Y.Map<any>;
export type SyncArrayElement = Y.Array<Y.Array<any>>;
export type SyncElement = Y.Array<SyncMapElement | SyncArrayElement>;
export type SharedType = Y.Map<SyncElement>;

export const createSharedType = () => {
    const doc = new Y.Doc();
    const sharedType = doc.getMap<any>('ai-table');
    return sharedType;
};

export const initSharedType = (
    doc: Y.Doc,
    initializeValue: {
        fields: DemoAIField[];
        records: DemoAIRecord[];
    }
) => {
    const sharedType = doc.getMap<any>('ai-table');
    toSharedType(sharedType, initializeValue);
    return sharedType;
};

export function toSharedType(
    sharedType: Y.Map<any>,
    data: {
        fields: DemoAIField[];
        records: DemoAIRecord[];
    }
): void {
    sharedType.doc!.transact(() => {
        const fieldSharedType = new Y.Array();
        fieldSharedType.insert(0, data.fields.map(toSyncElement));
        sharedType.set('fields', fieldSharedType);
        const recordSharedType = new Y.Array<Y.Array<any>>();
        sharedType.set('records', recordSharedType);
        recordSharedType.insert(0, data.records.map(toRecordSyncElement));
    });
}

export function toSyncElement(node: any): SyncMapElement {
    const element: SyncMapElement = new Y.Map();
    for (const key in node) {
        if (isArray(node[key])) {
            const arrayElement = new Y.Array();
            element.set(key, arrayElement);
            const arrayContainer = node[key].map(toSyncElement);
            arrayElement.insert(0, arrayContainer);
        } else if (isObject(node[key])) {
            const mapElement = toSyncElement(node[key]);
            element.set(key, mapElement);
        } else {
            element.set(key, node[key]);
        }
    }

    return element;
}

export function toRecordSyncElement(record: DemoAIRecord): Y.Array<Y.Array<any>> {
    const fixedFieldArray = new Y.Array();
    fixedFieldArray.insert(0, [record['id']]);

    const customFieldArray = new Y.Array();
    const customFields = [];
    for (const fieldId in record['values']) {
        customFields.push(record['values'][fieldId]);
    }
    customFieldArray.insert(0, customFields);

    const positionsArray: Y.Array<Positions> = new Y.Array();
    const positions = [];
    for (const viewId in record['positions']) {
        positions.push({
            [viewId]: record['positions'][viewId]
        });
    }
    positionsArray.insert(0, positions);

    // To save memory, convert map to array.
    const element = new Y.Array<Y.Array<any>>();
    element.insert(0, [fixedFieldArray, customFieldArray, positionsArray]);
    return element;
}
