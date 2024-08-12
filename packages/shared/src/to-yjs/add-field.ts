import { AddFieldAction, getDefaultFieldValue } from '@ai-table/grid';
import { SharedType, SyncArrayElement } from '../types';
import { toSyncElement } from '../utils';

export default function addField(sharedType: SharedType, action: AddFieldAction): SharedType {
    const fields = sharedType.get('fields');
    const path = action.path[0];
    if (fields) {
        fields.insert(path, [toSyncElement(action.field)]);
    }
    const records = sharedType.get('records') as SyncArrayElement;
    if (records) {
        for (let value of records) {
            const newRecord = getDefaultFieldValue(action.field);
            const customField = value.get(1);
            customField.insert(path, [newRecord]);
        }
    }

    return sharedType;
}
