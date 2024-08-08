import { isArray, isObject } from 'ngx-tethys/util';
import * as Y from 'yjs';
import { DemoAIField, DemoAIRecord, Positions } from '../types';
import { AITableView } from '../types/view';

export type SyncMapElement = Y.Map<any>;
export type SyncArrayElement = Y.Array<Y.Array<any>>;
export type SyncElement = Y.Array<SyncMapElement | SyncArrayElement>;
export type SharedType = Y.Map<SyncElement>;

export const createSharedType = (room: string) => {
    const doc = new Y.Doc({ guid: room });
    const sharedType = doc.getMap<any>('ai-table');
    return sharedType;
};

export const initSharedType = (
    doc: Y.Doc,
    initializeValue: {
        fields: DemoAIField[];
        records: DemoAIRecord[];
        views: AITableView[];
    },
    origin: any
) => {
    const sharedType = doc.getMap<any>('ai-table');
    toSharedType(sharedType, initializeValue, origin);
    return sharedType;
};

export function toSharedType(
    sharedType: Y.Map<any>,
    data: {
        fields: DemoAIField[];
        records: DemoAIRecord[];
        views: AITableView[];
    },
    origin: any
): void {
    sharedType.doc!.transact(() => {
        const fieldSharedType = new Y.Array();
        fieldSharedType.insert(0, data.fields.map(toSyncElement));
        sharedType.set('fields', fieldSharedType);

        const recordSharedType = new Y.Array<any>();
        sharedType.set('records', recordSharedType);
        recordSharedType.insert(0, data.records.map(recordToLive));

        const viewsSharedType = new Y.Array();
        sharedType.set('views', viewsSharedType);
        viewsSharedType.insert(0, data.views.map(toSyncElement));
    }, sharedType.doc);
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
    const nonEditableArray = new Y.Array();
    nonEditableArray.insert(0, [record['_id']]);

    const editableArray = new Y.Array();
    const editableFields = [];
    for (const fieldId in record['values']) {
        editableFields.push(record['values'][fieldId]);
    }
    editableArray.insert(0, [...editableFields, record['positions'] || {}]);

    // To save memory, convert map to array.
    const element = new Y.Array<Y.Array<any>>();
    element.insert(0, [nonEditableArray, editableArray]);
    return element;
}

export function recordToLive(record: DemoAIRecord): Y.Doc {
    const subDoc = new Y.Doc({ guid: record._id, autoLoad: true });
    subDoc.transact(() => {
        const yArray = subDoc.getArray();
        const nonEditableArray = new Y.Array();
        nonEditableArray.insert(0, [record['_id']]);

        const editableArray = new Y.Array();
        const editableFields = [];
        for (const fieldId in record['values']) {
            editableFields.push(record['values'][fieldId]);
        }
        editableArray.insert(0, [...editableFields, record['positions']]);
        // To save memory, convert map to array.
        yArray.insert(0, [nonEditableArray, editableArray]);
    });
    return subDoc;
}
