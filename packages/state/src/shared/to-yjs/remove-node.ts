import { ActionName, RemoveFieldAction, RemoveRecordAction } from '@ai-table/grid';
import {
    PositionActionName,
    RemoveRecordPositionAction,
    RemoveViewAction,
    SharedType,
    SyncArrayElement,
    SyncMapElement,
    ViewActionName
} from '../../types';
import { getSharedMapValueIndex, getSharedRecordIndex } from '../utils';
import * as Y from 'yjs';

export default function removeNode(
    sharedType: SharedType,
    action: RemoveFieldAction | RemoveRecordAction | RemoveViewAction | RemoveRecordPositionAction
): SharedType {
    const fields = sharedType.get('fields') as Y.Array<SyncMapElement>;
    const records = sharedType.get('records') as Y.Array<SyncArrayElement>;
    const views = sharedType.get('views')! as Y.Array<SyncMapElement>;

    switch (action.type) {
        case ActionName.RemoveRecord:
            if (records) {
                const recordIndex = getSharedRecordIndex(records, action.path[0]);
                if (recordIndex > -1) {
                    records.delete(recordIndex);
                }
            }
            break;
        case ViewActionName.RemoveView:
            if (views) {
                const viewIndex = getSharedMapValueIndex(views, action.path[0]);
                if (viewIndex > -1) {
                    views.delete(viewIndex);
                }
            }
            break;
        case PositionActionName.RemoveRecordPosition:
            if (records) {
                const recordIndex = getSharedRecordIndex(records, action.path[1]);
                const record = records.get(recordIndex);
                const customField = record.get(1) as Y.Array<any>;
                const positionsIndex = customField.length - 1;
                const positions = customField.get(positionsIndex);
                delete positions[action.path[0]];
                customField.delete(positionsIndex);
                customField.insert(positionsIndex, [positions]);
            }
            break;
        case ActionName.RemoveField:
            if (fields && records) {
                const fieldIndex = getSharedMapValueIndex(fields, action.path[0]);
                if (fieldIndex > -1) {
                    fields.delete(fieldIndex);
                    for (let value of records) {
                        value.get(1).delete(fieldIndex);
                    }
                }
            }
            break;
    }

    return sharedType;
}
