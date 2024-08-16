import { UpdateFieldValueAction } from '@ai-table/grid';
import { SharedType, SyncArrayElement } from '../../types';
import { getSharedMapValueIndex, getSharedRecordIndex } from '../utils';

export default function updateFieldValue(sharedType: SharedType, action: UpdateFieldValueAction): SharedType {
    const sharedRecords = sharedType.get('records');
    const sharedFields = sharedType.get('fields')!;
    if (sharedRecords && sharedFields) {
        const recordIndex = getSharedRecordIndex(sharedRecords, action.path[0]);
        const fieldIndex = getSharedMapValueIndex(sharedFields, action.path[1]);
        if (recordIndex > -1 && fieldIndex > -1) {
            const record = sharedRecords?.get(recordIndex) as SyncArrayElement;
            const customField = record.get(1);
            customField.delete(fieldIndex);
            customField.insert(fieldIndex, [action.newFieldValue]);
        }
    }

    return sharedType;
}
