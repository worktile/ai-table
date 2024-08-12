import { UpdateFieldValueAction } from '@ai-table/grid';
import { SharedType, SyncArrayElement } from '../../types';

export default function updateFieldValue(sharedType: SharedType, action: UpdateFieldValueAction): SharedType {
    const records = sharedType.get('records');
    if (records) {
        const record = records?.get(action.path[0]) as SyncArrayElement;
        const customField = record.get(1);
        const index = action.path[1];
        customField.delete(index);
        customField.insert(index, [action.newFieldValue]);
    }

    return sharedType;
}
