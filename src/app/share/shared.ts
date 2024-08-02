import { isArray, isObject } from 'ngx-tethys/util';
import * as Y from 'yjs';
import { DemoAIField, DemoAIRecord } from '../types';

export type SyncMapElement = Y.Map<any>;
export type SyncArrayElement = Y.Array<Y.Array<any>>;
export type SyncElement = Y.Array<SyncMapElement | SyncArrayElement>;
export type SharedType = Y.Map<SyncElement>;

export const getSharedType = (
    initializeValue: {
        fields: DemoAIField[];
        records: DemoAIRecord[];
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
        fields: DemoAIField[];
        records: DemoAIRecord[];
    }
): void {
    const fieldSharedType = new Y.Array();
    sharedType.set('fields', fieldSharedType);
    fieldSharedType.insert(0, data.fields.map(toSyncElement));

    const recordSharedType = new Y.Array<Y.Array<any>>();
    sharedType.set('records', recordSharedType);
    recordSharedType.insert(0, data.records.map(toRecordSyncElement));
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

    const positionArray = new Y.Array();
    const positions = [];
    for (const viewId in record['positions']) {
        positions.push(record['positions'][viewId]);
    }
    positionArray.insert(0, positions);

    // To save memory, convert map to array.
    const element = new Y.Array<Y.Array<any>>();
    element.insert(0, [fixedFieldArray, customFieldArray, positionArray]);
    return element;
}
