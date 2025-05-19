import * as Y from 'yjs';
import {
    AITableField,
    AITableRecord,
    AITableRecordUpdatedInfo,
    AITableView,
    AITableViewField,
    AITableViewFields,
    AITableViewRecord,
    AITableViewRecords,
    CustomFieldValues,
    FieldValue,
    Id,
    Positions,
    RecordSyncElement,
    SharedRecordJsonType,
    SyncArrayElement,
    SyncMapElement,
    SystemFieldValues,
    TrackableEntity,
    TransactionOriginInfo
} from '../types';
import { AI_TABLE_CONTENT_FIELD_NAME, SystemFieldIndex } from '../constants';
import ObjectID from 'bson-objectid';
import { isNumber } from 'lodash';

export const getIdBySystemFieldValuesType = (systemFieldValuesType: Y.Array<any>): string => {
    return systemFieldValuesType.get(SystemFieldIndex.Id)['_id'];
};

export function getSharedMapValueIndex(sharedNodes: Y.Array<SyncMapElement>, id: string) {
    let nodeIndex = -1;
    for (let index = 0; index < sharedNodes.length; index++) {
        const sharedId = getSharedMapValueId(sharedNodes, index);
        if (sharedId === id) {
            nodeIndex = index;
            break;
        }
    }
    return nodeIndex;
}

export function getSharedRecordIndex(sharedRecords: Y.Array<SyncArrayElement>, recordId: string) {
    let recordIndex = -1;
    for (let index = 0; index < sharedRecords.length; index++) {
        const sharedRecordId = getSharedRecordId(sharedRecords, index);
        if (sharedRecordId === recordId) {
            recordIndex = index;
            break;
        }
    }
    return recordIndex;
}

export function translatePositionToPath(
    data: AITableViewRecords | AITableViewFields,
    position: number,
    activeViewId: string,
    indexOffset: number = 0
) {
    let index = data.findIndex((value, index) => {
        if (index === 0) {
            return position < value.positions[activeViewId];
        }
        return position > data[index - 1].positions[activeViewId] && position < value.positions[activeViewId];
    });
    if (index === -1) {
        index = data.length;
    }
    return [index + indexOffset];
}

export function toAITableSharedType(
    sharedType: Y.Map<any>,
    data: { fields: AITableField[]; records: AITableViewRecord[]; views: AITableView[] },
    operationContext?: TransactionOriginInfo
): void {
    sharedType.doc!.transact(
        () => {
            const fieldSharedType = new Y.Array();
            fieldSharedType.insert(0, data.fields.map(toMapSyncElement));
            sharedType.set('fields', fieldSharedType);

            const recordSharedType = new Y.Array<Y.Array<any>>();
            sharedType.set('records', recordSharedType);
            recordSharedType.insert(
                0,
                data.records.map((record) => toRecordSyncElement(record, data.fields))
            );

            const viewsSharedType = new Y.Array();
            sharedType.set('views', viewsSharedType);
            viewsSharedType.insert(0, data.views.map(toMapSyncElement));
        },
        operationContext ? ({ uid: operationContext.uid } as TransactionOriginInfo) : null
    );
}

export function toMapSyncElement(node: any): SyncMapElement {
    const element: SyncMapElement = new Y.Map();
    for (const key in node) {
        element.set(key, !isNumber(node[key]) && ObjectID.isValid(node[key]) ? node[key].toString() : node[key]);
    }
    return element;
}

export function toRecordSyncElement(record: AITableViewRecord, fields: AITableField[]): Y.Array<Y.Array<any>> {
    const systemFieldValues = new Y.Array();
    // 临时方案：为了解决删除时协同操作无法精准获取删除的 id 的问题，将原来的[idValue] 改为[{'_id': idValue}]
    systemFieldValues.insert(0, getSystemFieldValues(record));
    const customFieldValues = new Y.Array();
    const valuesArray: FieldValue[] = [];
    fields.forEach((field: AITableField) => {
        let value = record['values'][field._id.toString()];
        // yjs will throw an error if the value is undefined.
        if (value === undefined) {
            value = null;
        }
        valuesArray.push(value);
    });
    // To save memory, convert map to array.
    customFieldValues.insert(0, valuesArray);
    const element = new Y.Array<Y.Array<any>>();
    element.insert(0, [systemFieldValues, customFieldValues]);
    return element;
}

export function getShareTypeNumberPath(path: (string | number)[]): number[] {
    return path.filter((node) => typeof node === 'number') as number[];
}

export function getSharedRecord(records: Y.Array<SyncArrayElement>, recordIndex: number) {
    return records && (records as Y.Array<SyncArrayElement>).get(recordIndex);
}

export function getSharedRecordId(records: Y.Array<SyncArrayElement>, recordIndex: number) {
    return records && (records as Y.Array<SyncArrayElement>).get(recordIndex).get(0).get(0)['_id'];
}

export function getSharedMapValueId(values: Y.Array<SyncMapElement>, index: number) {
    return values && values.get(index).get('_id');
}

export function getSharedMapId(value: SyncMapElement) {
    return value.get('_id') as string;
}

export function getSharedFields(doc: Y.Doc) {
    const fields = (doc.getMap(AI_TABLE_CONTENT_FIELD_NAME).get('fields') as Y.Array<SyncMapElement>).toJSON();
    return fields;
}

export const getSystemFieldValues = (record: AITableViewRecord): SystemFieldValues => {
    return [
        { _id: record['_id'].toString() },
        record.short_id,
        record.created_at as number,
        record.created_by,
        record['positions'],
        record.updated_at as number,
        record.updated_by
    ];
};

export function flushUpdates(updates: Uint8Array[]): Uint8Array {
    const newDoc = new Y.Doc();
    updates.forEach((buffer) => {
        Y.applyUpdate(newDoc, new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength));
    });
    return Y.encodeStateAsUpdate(newDoc);
}

export const getIdBySystemFieldValues = (systemFieldValues: SystemFieldValues): string => {
    return systemFieldValues[0]['_id'];
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

export const getPositionsByRecordSyncElement = (recordSyncElement: RecordSyncElement) => {
    const systemFieldType = recordSyncElement.get(0) as Y.Array<any>;
    const positions = systemFieldType.get(SystemFieldIndex.Positions);
    return positions;
};

export const getPositionsBySystemFieldValues = (systemFieldValues: SystemFieldValues): Positions => {
    return systemFieldValues[SystemFieldIndex.Positions];
};

export const getValuesByCustomFieldValues = (customFieldValues: CustomFieldValues, fields: Pick<AITableViewField, '_id'>[]) => {
    const fieldIds = fields.map((item) => item._id);
    const recordValue: Record<string, any> = {};
    fieldIds.forEach((item, index) => {
        const value = customFieldValues[index];
        recordValue[item.toString()] = value === undefined ? null : value;
    });
    return recordValue;
};

export const getRecordsBySharedJson = (pageId: Id, recordJsonArray: SharedRecordJsonType[], fields: AITableField[]): AITableRecord[] => {
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

export const setRecordPositions = (recordSyncElement: RecordSyncElement, newPositions: Positions) => {
    const systemFieldType = recordSyncElement.get(0) as Y.Array<any>;
    systemFieldType.delete(SystemFieldIndex.Positions);
    systemFieldType.insert(SystemFieldIndex.Positions, [newPositions]);
};

export const setRecordUpdatedInfo = (recordSyncElement: RecordSyncElement, info: AITableRecordUpdatedInfo) => {
    const systemFieldType = recordSyncElement.get(0) as Y.Array<any>;
    systemFieldType.delete(SystemFieldIndex.UpdatedAt, 2);
    systemFieldType.insert(SystemFieldIndex.UpdatedAt, [info.updated_at, info.updated_by]);
};
