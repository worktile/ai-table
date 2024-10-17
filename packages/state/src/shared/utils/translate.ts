import { TrackableEntity } from '@ai-table/grid';
import { AITableViewFields, AITableViewRecord, AITableViewRecords, Positions, SyncArrayElement, SyncMapElement } from '../../types';
import * as Y from 'yjs';

export const translateToRecordValues = (arrayRecord: any[], fields: AITableViewFields) => {
    const fieldIds = fields.map((item) => item._id);
    const recordValue: Record<string, any> = {};
    fieldIds.forEach((item, index) => {
        recordValue[item] = arrayRecord[index] || '';
    });
    return recordValue;
};

export const translateToRecords = (arrayRecords: any[], fields: AITableViewFields): AITableViewRecords => {
    return arrayRecords.map((record: any) => {
        const [systemFieldValues, customFieldValues] = record;
        return {
            _id: getIdBySystemFieldValues(systemFieldValues),
            ...getTrackableEntityBySystemFieldValues(systemFieldValues),
            positions: getPositionsBySystemFieldValues(customFieldValues),
            values: translateToRecordValues(customFieldValues, fields)
        };
    });
};

export function translatePositionToPath(data: AITableViewRecords | AITableViewFields, position: number, activeViewId: string) {
    let index = data.findIndex((value, index) => {
        if (index === 0) {
            return position < value.positions[activeViewId];
        }
        return position > data[index - 1].positions[activeViewId] && position < value.positions[activeViewId];
    });
    if (index === -1) {
        index = data.length;
    }

    return [index];
}

export function getShareTypeNumberPath(path: (string | number)[]): number[] {
    return path.filter((node) => typeof node === 'number') as number[];
}

export function getSharedRecordId(records: Y.Array<SyncArrayElement>, recordIndex: number) {
    return records && (records as Y.Array<SyncArrayElement>).get(recordIndex).get(0).get(0)['_id'];
}

export function getSharedMapValueId(values: Y.Array<SyncMapElement>, index: number) {
    return values && values.get(index).get('_id');
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

export const getSystemFieldValues = (record: AITableViewRecord) => {
    return [{ _id: record['_id'] }, record.created_at, record.created_by, record.updated_at, record.updated_by];
};

export const getTrackableEntityBySystemFieldValues = (systemFieldValues: Array<any>): TrackableEntity => {
    return {
        created_at: systemFieldValues[1],
        created_by: systemFieldValues[2],
        updated_at: systemFieldValues[3],
        updated_by: systemFieldValues[4]
    };
};

export const getIdBySystemFieldValues = (systemFieldValues: Array<any>): string => {
    return systemFieldValues[0]['_id'];
};

export const getPositionsBySystemFieldValues = (customFieldValues: Array<any>): Positions => {
    return customFieldValues[customFieldValues.length - 1];
};
