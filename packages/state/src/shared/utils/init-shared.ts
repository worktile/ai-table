import * as Y from 'yjs';
import { AITableViewFields, AITableViewRecord, AITableViewRecords, AITableViews, SyncMapElement } from '../../types';
import { getSystemFieldValues } from './translate';

export const createSharedType = () => {
    const doc = new Y.Doc();
    const sharedType = doc.getMap<any>('ai-table');
    return sharedType;
};

export const initSharedType = (
    doc: Y.Doc,
    initializeValue: {
        fields: AITableViewFields;
        records: AITableViewRecords;
        views: AITableViews;
    }
) => {
    const sharedType = doc.getMap<any>('ai-table');
    toSharedType(sharedType, initializeValue);
    return sharedType;
};

export function toSharedType(
    sharedType: Y.Map<any>,
    data: {
        fields: AITableViewFields;
        records: AITableViewRecords;
        views: AITableViews;
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

export function toRecordSyncElement(record: AITableViewRecord): Y.Array<Y.Array<any>> {
    // [_id, created_at, created_by, updated_at, updated_by]
    const systemFieldValues = new Y.Array();
    // 临时方案：为了解决删除时协同操作无法精准获取删除的 id 的问题，将原来的[idValue] 改为[{'_id': idValue}]
    systemFieldValues.insert(0, getSystemFieldValues(record));
    const customFieldValues = new Y.Array();
    const editableFields = [];
    for (const fieldId in record['values']) {
        editableFields.push(record['values'][fieldId]);
    }
    // TODO: 后续 positions 挪入 systemFieldValues
    customFieldValues.insert(0, [...editableFields, record['positions']]);

    // To save memory, convert map to array.
    const element = new Y.Array<Y.Array<any>>();
    element.insert(0, [systemFieldValues, customFieldValues]);
    return element;
}
