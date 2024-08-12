import * as Y from 'yjs';
import { AITableSharedRecord, Positions, SyncMapElement } from '../../types';


export const createSharedType = () => {
    const doc = new Y.Doc();
    const sharedType = doc.getMap<any>('ai-table');
    return sharedType;
};

export const initSharedType = <T>(
    doc: Y.Doc,
    initializeValue: {
        fields: Positions[];
        records: AITableSharedRecord[];
        views: T[];
    }
) => {
    const sharedType = doc.getMap<any>('ai-table');
    toSharedType(sharedType, initializeValue);
    return sharedType;
};

export function toSharedType<T>(
    sharedType: Y.Map<any>,
    data: {
        fields: Positions[];
        records: AITableSharedRecord[];
        views: T[];
    }
): void {
    sharedType.doc!.transact(() => {
        const fieldSharedType = new Y.Array();
        fieldSharedType.insert(0, data.fields.map(toSyncElement));
        sharedType.set('fields', fieldSharedType);

        const recordSharedType = new Y.Array<Y.Array<any>>();
        sharedType.set('records', recordSharedType);
        recordSharedType.insert(0, data.records.map(toRecordSyncElement));

        const viewsSharedType = new Y.Array();
        sharedType.set('views', viewsSharedType);
        viewsSharedType.insert(0, data.views.map(toSyncElement));
    });
}

export function toSyncElement(node: any): SyncMapElement {
    const element: SyncMapElement = new Y.Map();
    for (const key in node) {
        element.set(key, node[key]);
    }
    return element;
}

export function toRecordSyncElement(record: AITableSharedRecord): Y.Array<Y.Array<any>> {
    const nonEditableArray = new Y.Array();
    nonEditableArray.insert(0, [record['_id']]);

    const editableArray = new Y.Array();
    const editableFields = [];
    for (const fieldId in record['values']) {
        editableFields.push(record['values'][fieldId]);
    }
    editableArray.insert(0, [...editableFields, record['positions']]);

    // To save memory, convert map to array.
    const element = new Y.Array<Y.Array<any>>();
    element.insert(0, [nonEditableArray, editableArray]);
    return element;
}
