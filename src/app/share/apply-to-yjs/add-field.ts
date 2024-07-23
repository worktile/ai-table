import { SharedType, toSyncElement } from '../shared';
import { AddFieldAction } from '@ai-table/grid';
import * as Y from 'yjs';

export default function addField(sharedType: SharedType, action: AddFieldAction): SharedType {
    const fields = sharedType.get('fields');
    const path = action.path[0];
    if (fields) {
        fields.insert(path, [toSyncElement(action.field)]);
    }
    const records = sharedType.get('records');
    if (records) {
        records.forEach((item) => {
            const value = item.get('value') as Y.Array<any>;
            const newRecord = {
                id: action.field.id,
                fieldValue: ''
            };
            value.insert(path, [toSyncElement(newRecord)]);
        });
    }

    return sharedType;
}
