import { RemoveFieldAction } from '@ai-table/grid';
import { SharedType, SyncArrayElement, SyncMapElement } from '../../types';
import { getSharedMapValueIndex } from '../utils';
import * as Y from 'yjs';

export default function removeField(sharedType: SharedType, action: RemoveFieldAction): SharedType {
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
    return sharedType;
}
