import { SharedType, SyncArrayElement, toSyncElement } from '../shared';
import { AddFieldAction, AITable, getDefaultFieldValue } from '@ai-table/grid';

export default function addField(sharedType: SharedType, action: AddFieldAction, aiTable: AITable): SharedType {
    const fields = sharedType.get('fields');
    const path = action.path[0];
    if (fields) {
        fields.insert(path, [toSyncElement(action.field)]);
    }
    const records = sharedType.get('records') as SyncArrayElement;
    if (records) {
        for (let value of records) {
            const newRecord = getDefaultFieldValue(action.field.type);
            const customField = value.get(1);
            customField.insert(path, [newRecord]);
        }
    }

    return sharedType;
}
