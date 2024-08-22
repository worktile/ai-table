import { ActionName, RemoveFieldAction, RemoveRecordAction } from '@ai-table/grid';
import { RemoveViewAction, SharedType, SyncArrayElement, SyncMapElement, ViewActionName } from '../../types';
import { getSharedMapValueIndex, getSharedRecordIndex } from '../utils';
import * as Y from 'yjs';

export default function removeNode(sharedType: SharedType, action: RemoveFieldAction | RemoveRecordAction | RemoveViewAction): SharedType {
    switch (action.type) {
        case ActionName.RemoveRecord:
            const records = sharedType.get('records')! as Y.Array<SyncArrayElement>;
            if (records) {
                const recordIndex = getSharedRecordIndex(records, action.path[0]);
                if (recordIndex > -1) {
                    records.delete(recordIndex);
                }
            }
            break;
        case ViewActionName.RemoveView:
            const views = sharedType.get('views')! as Y.Array<SyncMapElement>;
            if (views) {
                const viewIndex = getSharedMapValueIndex(views, action.path[0]);
                if (viewIndex > -1) {
                    views.delete(viewIndex);
                }
            }
            break;
        case ActionName.RemoveField:
            const sharedFields = sharedType.get('fields') as Y.Array<SyncMapElement>;
            const sharedRecords = sharedType.get('records') as Y.Array<SyncArrayElement>;
            if (sharedFields && sharedRecords) {
                const fieldIndex = getSharedMapValueIndex(sharedFields, action.path[0]);
                if (fieldIndex > -1) {
                    sharedFields.delete(fieldIndex);
                    for (let value of sharedRecords) {
                        value.get(1).delete(fieldIndex);
                    }
                }
            }
            break;
    }

    return sharedType;
}
