import { toRecordSyncElement, toSyncElement } from '../utils';
import { AddViewAction, AITableViewRecord, SharedType, SyncArrayElement, ViewActionName } from '../../types';
import { ActionName, AddFieldAction, AddRecordAction, getDefaultFieldValue } from '@ai-table/grid';

export default function addNode(sharedType: SharedType, action: AddFieldAction | AddRecordAction | AddViewAction): SharedType {
    switch (action.type) {
        case ActionName.AddRecord:
            const records = sharedType.get('records')!;
            records && records.push([toRecordSyncElement(action.record as AITableViewRecord)]);
            break;
        case ViewActionName.AddView:
            const views = sharedType.get('views')!;
            views && views.push([toSyncElement(action.view)]);
            break;
        case ActionName.AddField:
            const sharedFields = sharedType.get('fields')!;
            const sharedRecords = sharedType.get('records') as SyncArrayElement;
            if (sharedFields && sharedRecords) {
                sharedFields.push([toSyncElement(action.field)]);
                const path = action.path[0];
                for (let value of sharedRecords) {
                    const newRecord = getDefaultFieldValue(action.field);
                    const customField = value.get(1);
                    customField.insert(path, [newRecord]);
                }
            }
            break;
    }

    return sharedType;
}
