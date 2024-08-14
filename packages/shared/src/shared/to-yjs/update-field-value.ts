import { UpdateFieldValueAction } from '@ai-table/grid';
import { SharedType, SyncArrayElement } from '../../types';
import { translateIdsToIndex } from '../utils/translate';

export default function updateFieldValue(sharedType: SharedType, action: UpdateFieldValueAction): SharedType {
    const sharedRecords = sharedType.get('records');
    if (sharedRecords) {
        const { recordIndex, fieldIndex } = translateIdsToIndex(sharedType, action.path[0], action.path[1]);
        const record = sharedRecords?.get(recordIndex) as SyncArrayElement;
        const customField = record.get(1);
        customField.delete(fieldIndex);
        customField.insert(fieldIndex, [action.newFieldValue]);
    }

    return sharedType;
}
