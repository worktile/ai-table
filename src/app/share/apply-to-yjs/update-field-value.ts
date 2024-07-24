import { SharedType, SyncArrayElement } from '../shared';
import { UpdateFieldValueAction } from '@ai-table/grid';

export default function updateFieldValue(sharedType: SharedType, action: UpdateFieldValueAction): SharedType {
    const records = sharedType.get('records');
    if (records) {
        const record = records?.get(action.path[0]) as SyncArrayElement;
        const index = action.path[1] + 1;
        record.delete(index);
        record.insert(index, [action.newFieldValue]);
    }

    return sharedType;
}
