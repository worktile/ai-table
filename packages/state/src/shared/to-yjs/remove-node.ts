import * as Y from 'yjs';
import { ActionName, RemoveFieldAction, RemoveRecordAction, RemoveViewAction } from '@ai-table/utils';
import { AITable } from '@ai-table/grid';
import { getSharedMapValueIndex, getSharedRecordIndex, SharedType, SyncArrayElement, SyncMapElement } from '@ai-table/utils';

export default function removeNode(
    aiTable: AITable,
    sharedType: SharedType,
    action: RemoveFieldAction | RemoveRecordAction | RemoveViewAction
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
        case ActionName.RemoveView:
            if (views) {
                const viewIndex = getSharedMapValueIndex(views, action.path[0]);
                if (viewIndex > -1) {
                    views.delete(viewIndex);
                }
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
