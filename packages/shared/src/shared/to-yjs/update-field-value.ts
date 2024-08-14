import { UpdateFieldValueAction } from '@ai-table/grid';
import { SharedType, SyncArrayElement, SyncMapElement } from '../../types';

export default function updateFieldValue(sharedType: SharedType, action: UpdateFieldValueAction): SharedType {
    const sharedRecords = sharedType.get('records');
    const sharedFields = sharedType.get('fields')!;
    if (sharedRecords && sharedFields) {
        let recordIndex = -1;
        let fieldIndex = -1;
        for (let index = 0; index < sharedRecords.length; index++) {
            if ((sharedRecords.get(index) as SyncArrayElement).get(0).get(0) === action.path[0]) {
                recordIndex = index;
                break;
            }
        }
        for (let index = 0; index < sharedFields.length; index++) {
            if ((sharedFields.get(index) as SyncMapElement).get('_id') === action.path[1]) {
                fieldIndex = index;
                break;
            }
        }
        if (recordIndex > -1 && fieldIndex > -1) {
            const record = sharedRecords?.get(recordIndex) as SyncArrayElement;
            const customField = record.get(1);
            customField.delete(fieldIndex);
            customField.insert(fieldIndex, [action.newFieldValue]);
        }
    }

    return sharedType;
}
