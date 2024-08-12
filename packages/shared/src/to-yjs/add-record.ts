import { AddRecordAction } from '@ai-table/grid';
import { AITableSharedRecord, SharedType } from '../types';
import { toRecordSyncElement } from '../utils';

export default function addRecord(sharedType: SharedType, action: AddRecordAction): SharedType {
    const records = sharedType.get('records');
    if (records) {
        const path = action.path[0];
        records.insert(path, [toRecordSyncElement(action.record as AITableSharedRecord)]);
    }

    return sharedType;
}
