import { SharedType, toRecordSyncElement } from '../shared';
import { AddRecordAction } from '@ai-table/grid';

export default function addRecord(sharedType: SharedType, action: AddRecordAction): SharedType {
    const records = sharedType.get('records');
    if (records) {
        const path = action.path[0];
        records.insert(path, [toRecordSyncElement(action.record)])
    }

    return sharedType;
}
