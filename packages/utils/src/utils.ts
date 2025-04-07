import * as Y from "yjs";
import { AITableField, AITableRecord, AITableView, AITableViewRecord, CustomFieldValues, FieldValue, Positions, SharedRecordJsonType, SyncArrayElement, SyncMapElement, SystemFieldValues, TrackableEntity, TransactionOriginInfo } from "./types";
import { AI_TABLE_CONTENT_FIELD_NAME, SystemFieldIndex } from "./constants";
import { Id } from "ngx-tethys/types";

export function toAITableSharedType(
    sharedType: Y.Map<any>,
    data: {
        fields: AITableField[];
        records: AITableViewRecord[];
        views: AITableView[];
    },
    operationContext?: TransactionOriginInfo
): void {
    sharedType.doc!.transact(
        () => {
            const fieldSharedType = new Y.Array();
            fieldSharedType.insert(0, data.fields.map(toAITableSyncElement));
            sharedType.set("fields", fieldSharedType);

            const recordSharedType = new Y.Array<Y.Array<any>>();
            sharedType.set("records", recordSharedType);
            recordSharedType.insert(
                0,
                data.records.map((record) => toAITableRecordSyncElement(record, data.fields))
            );

            const viewsSharedType = new Y.Array();
            sharedType.set("views", viewsSharedType);
            viewsSharedType.insert(0, data.views.map(toAITableSyncElement));
        },
        operationContext ? ({ uid: operationContext.uid } as TransactionOriginInfo) : null
    );
}

export function toAITableSyncElement(node: any): SyncMapElement {
    const element: SyncMapElement = new Y.Map();
    for (const key in node) {
        element.set(key, node[key].toString());
    }
    return element;
}

export function toAITableRecordSyncElement(record: AITableViewRecord, fields: AITableField[]): Y.Array<Y.Array<any>> {
    const systemFieldValues = new Y.Array();
    systemFieldValues.insert(0, getSystemFieldValues(record));
    const customFieldValues = new Y.Array();
    const valuesArray: FieldValue[] = [];
    fields.forEach((field: AITableField) => {
        valuesArray.push(record["values"][field._id.toString()]);
    });
    customFieldValues.insert(0, valuesArray);
    const element = new Y.Array<Y.Array<any>>();
    element.insert(0, [systemFieldValues, customFieldValues]);
    return element;
}

export function isAddOrRemove(targetPath: number[]): boolean {
    return targetPath.length === 0;
}

export function getShareTypeNumberPath(path: (string | number)[]): number[] {
    return path.filter((node) => typeof node === "number") as number[];
}

export function getSharedRecordId(records: Y.Array<SyncArrayElement>, recordIndex: number) {
    return records && (records as Y.Array<SyncArrayElement>).get(recordIndex).get(0).get(0)["_id"];
}

export function getSharedMapValueId(values: Y.Array<SyncMapElement>, index: number) {
    return values && values.get(index).get("_id");
}

export function getSharedFields(doc: Y.Doc) {
    const fields = (doc.getMap(AI_TABLE_CONTENT_FIELD_NAME).get("fields") as Y.Array<SyncMapElement>).toJSON();
    return fields;
}

export const getSystemFieldValues = (record: AITableViewRecord): SystemFieldValues => {
    return [
        { _id: record["_id"].toString() },
        record.short_id,
        record.created_at,
        record.created_by,
        record["positions"],
        record.updated_at,
        record.updated_by
    ];
};

export function flushUpdates(updates: Buffer[]): Uint8Array {
    const newDoc = new Y.Doc();
    updates.forEach((buffer) => {
        Y.applyUpdate(newDoc, new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength));
    });
    return Y.encodeStateAsUpdate(newDoc);
}

export const getIdBySystemFieldValues = (systemFieldValues: SystemFieldValues): string => {
    return systemFieldValues[0]["_id"];
};

export const getShortIdBySystemFieldValues = (systemFieldValues: SystemFieldValues): string => {
    return systemFieldValues[SystemFieldIndex.ShortId];
};

export const getTrackableEntityBySystemFieldValues = (systemFieldValues: SystemFieldValues): TrackableEntity => {
    return {
        created_at: systemFieldValues[SystemFieldIndex.CreatedAt],
        created_by: systemFieldValues[SystemFieldIndex.CreatedBy],
        updated_at: systemFieldValues[SystemFieldIndex.UpdatedAt],
        updated_by: systemFieldValues[SystemFieldIndex.UpdatedBy]
    };
};

export const getPositionsBySystemFieldValues = (systemFieldValues: SystemFieldValues): Positions => {
    return systemFieldValues[SystemFieldIndex.Positions];
};

export const getValuesByCustomFieldValues = (customFieldValues: CustomFieldValues, fields: AITableField[]) => {
    const fieldIds = fields.map((item) => item._id);
    const recordValue: Record<string, any> = {};
    fieldIds.forEach((item, index) => {
        recordValue[item.toString()] = customFieldValues[index] || "";
    });
    return recordValue;
};

export const getRecordsBySharedJson = (
    pageId: Id,
    recordJsonArray: SharedRecordJsonType[],
    fields: AITableField[]
): AITableRecord[] => {
    return recordJsonArray.map((record: SharedRecordJsonType) => {
        const [systemFieldValues, customFieldValues] = record;
        return {
            _id: getIdBySystemFieldValues(systemFieldValues),
            short_id: getShortIdBySystemFieldValues(systemFieldValues),
            page_id: pageId,
            ...getTrackableEntityBySystemFieldValues(systemFieldValues),
            positions: getPositionsBySystemFieldValues(systemFieldValues),
            values: getValuesByCustomFieldValues(customFieldValues, fields)
        };
    });
};