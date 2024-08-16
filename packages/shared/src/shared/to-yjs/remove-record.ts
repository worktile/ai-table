import { RemoveRecordAction } from '@ai-table/grid';
import { SharedType } from '../../types';
import { getSharedRecordIndex } from '../utils';

export default function removeRecord(sharedType: SharedType, action: RemoveRecordAction): SharedType {
    const sharedRecords = sharedType.get('records');
    if (sharedRecords) {
        const recordIndex = getSharedRecordIndex(sharedRecords, action.path[0]);
        if (recordIndex > -1) {
            sharedRecords.delete(recordIndex);
        }
    }
    return sharedType;
}
