import { SharedType, SyncArrayElement, toSyncElement } from '../shared';
import { AddFieldAction, getDefaultFieldValue } from '@ai-table/grid';

export default function addField(sharedType: SharedType, action: AddFieldAction): SharedType {
    const fields = sharedType.get('fields');
    const path = action.path[0];
    if (fields) {
        fields.insert(path, [toSyncElement(action.field)]);
    }
    const records = sharedType.get('records') as SyncArrayElement;
    if (records) {
        for (let value of records) {
            const newRecord = getDefaultFieldValue(action.field.type);
            value.insert(path + 1, [newRecord]);
        }
    }

    return sharedType;
}
