import { DemoAIRecord } from '../../types';
import { SharedType, toRecordSyncElement } from '../shared';
import { AddRecordAction, AITable } from '@ai-table/grid';

export default function addRecord(sharedType: SharedType, action: AddRecordAction, aiTable: AITable): SharedType {
    const records = sharedType.get('records');
    if (records) {
        const path = action.path[0];
        records.insert(path, [toRecordSyncElement(action.record as DemoAIRecord)]);
    }
    return sharedType;
}
