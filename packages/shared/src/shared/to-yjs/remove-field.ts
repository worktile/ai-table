import { SharedType, SyncArrayElement } from '../../types';
import { getSharedMapValueIndex } from '../utils';
import { RemoveFieldAction } from 'dist/grid';

export default function removeField(sharedType: SharedType, action: RemoveFieldAction): SharedType {
    const sharedFields = sharedType.get('fields');
    const sharedRecords = sharedType.get('records') as SyncArrayElement;
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
