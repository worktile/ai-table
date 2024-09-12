import { AITableViewFields, AITableViewRecord, AITableViewRecords, AITableViews, toSyncElement } from '@ai-table/state';
import * as Y from 'yjs';
import { LiveFeedObject } from '../live-feed/feed-object';

export const initSharedType = (
    tableDoc: Y.Doc,
    initializeValue: {
        fields: AITableViewFields;
        records: AITableViewRecords;
        views: AITableViews;
    }
) => {
    const sharedType = tableDoc.getMap<any>('ai-table');
    toSharedTable(sharedType, initializeValue);
    return sharedType;
};

export function toSharedTable(
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
        const viewsSharedType = new Y.Array();
        sharedType.set('views', viewsSharedType);
        viewsSharedType.insert(0, data.views.map(toSyncElement));
    });
}

export function toSharedRecords(
    tableDoc: Y.Doc,
    data: {
        fields: AITableViewFields;
        records: AITableViewRecords;
        views: AITableViews;
    }
) {
    const recordDocs: LiveFeedObject[] = [];
    tableDoc.transact(() => {
        data.records.forEach((record) => {
            const typeName = 'record-array';
            const recordDoc = new LiveFeedObject({ guid: record._id, typeName });
            const yArray = recordDoc.getArray(typeName);
            yArray.insert(0, toRecordSyncElement(record))
        });
    });
    return recordDocs;
}

export function toRecordSyncElement(record: AITableViewRecord): Array<Y.Array<any>> {
    const nonEditableArray = new Y.Array<any>();
    // 临时方案：为了解决删除时协同操作无法精准获取删除的 id 的问题，将原来的[idValue] 改为[{'_id': idValue}]
    // 后续可能改为 YMap 或者通过在 views 中存储 positions 解决
    nonEditableArray.insert(0, [{ _id: record['_id'] }]);

    const editableArray = new Y.Array<any>();
    const editableFields = [];
    for (const fieldId in record['values']) {
        editableFields.push(record['values'][fieldId]);
    }
    editableArray.insert(0, [...editableFields, record['positions']]);

    return [nonEditableArray, editableArray];
}
