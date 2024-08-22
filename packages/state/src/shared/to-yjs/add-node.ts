import { toRecordSyncElement, toSyncElement } from '../utils';
import { AddViewAction, SharedType, SyncArrayElement, SyncMapElement, ViewActionName } from '../../types';
import { ActionName, AddFieldAction, AddRecordAction, AITableRecord, getDefaultFieldValue } from '@ai-table/grid';
import * as Y from 'yjs';

export default function addNode(sharedType: SharedType, action: AddFieldAction | AddRecordAction | AddViewAction): SharedType {
    const records = sharedType.get('records')! as Y.Array<SyncArrayElement>;
    const views = sharedType.get('views') as Y.Array<SyncMapElement>;
    const fields = sharedType.get('fields')!;
    switch (action.type) {
        case ActionName.AddRecord:
            if (records && views) {
                records.push([toRecordSyncElement(action.record as AITableRecord)]);
                const path = action.path[0];
                for (let value of views) {
                    const positions = value.get('recordPositions');
                    positions.insert(path, action.record._id);
                }
            }
            break;
        case ViewActionName.AddView:
            views && views.push([toSyncElement(action.view)]);
            break;
        case ActionName.AddField:
            if (fields && records && fields) {
                fields.push([toSyncElement(action.field)]);
                const path = action.path[0];
                for (let value of records) {
                    const newRecord = getDefaultFieldValue(action.field);
                    const customField = value.get(1);
                    customField.insert(path, [newRecord]);
                }
                for (let value of views) {
                    const positions = value.get('fieldRecords');
                    positions.insert(path, action.field._id);
                }
            }
            break;
    }

    return sharedType;
}
