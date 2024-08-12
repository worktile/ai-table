import { Array } from 'yjs';
import { DemoAIRecord } from '../../types';
import { recordToLive, SharedType } from '../shared';
import { AddRecordAction, AITable } from '@ai-table/grid';

export default function addRecord(sharedType: SharedType, action: AddRecordAction, aiTable: AITable): SharedType {
    const records = sharedType.get('records') as Array<any>;
    if (records) {
        const path = action.path[0];
        records.insert(path, [recordToLive(action.record as DemoAIRecord)]);
    }
    return sharedType;
}
