import { AddRecordAction } from '@ai-table/grid';
import { toRecordSyncElement } from '../utils';
import { AITableViewRecord, SharedType } from '../../types';

export default function addRecord(sharedType: SharedType, action: AddRecordAction): SharedType {
    const records = sharedType.get('records');
    if (records) {
        records.push([toRecordSyncElement(action.record as AITableViewRecord)]);
    }

    return sharedType;
}
