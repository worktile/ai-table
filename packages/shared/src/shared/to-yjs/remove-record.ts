import { RemoveRecordAction } from '@ai-table/grid';
import { SharedType, SyncArrayElement } from '../../types';
import { getSharedRecordIndex } from '../utils';
import * as Y from 'yjs';

export default function removeRecord(sharedType: SharedType, action: RemoveRecordAction): SharedType {
    const sharedRecords = sharedType.get('records') as Y.Array<SyncArrayElement>;
    if (sharedRecords) {
        const recordIndex = getSharedRecordIndex(sharedRecords, action.path[0]);
        if (recordIndex > -1) {
            sharedRecords.delete(recordIndex);
        }
    }
    return sharedType;
}
