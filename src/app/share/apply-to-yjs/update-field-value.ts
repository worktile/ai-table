import { Array } from 'yjs';
import { LiveBlockProvider } from '../live-block-provider';
import { SharedType, SyncArrayElement } from '../shared';
import { AITable, getRecordOrField, UpdateFieldValueAction } from '@ai-table/grid';

export default function updateFieldValue(sharedType: SharedType, action: UpdateFieldValueAction, aiTable: AITable): SharedType {
    // const records = sharedType.get('records');
    const record = aiTable.records()[action.path[0]]
    if (record && sharedType.doc['liveBlocks']) {
        const liveBlock = sharedType.doc['liveBlocks'].get(record._id) as LiveBlockProvider;
        const recordArray = liveBlock.doc.getArray();
        // const record = records?.get(action.path[0]) as SyncArrayElement;
        const customField = recordArray.get(1) as Array<any>;
        const index = action.path[1];
        liveBlock.doc.transact(() => {
            customField.delete(index);
            customField.insert(index, [action.newFieldValue]);
        });
    }
    return sharedType;
}
