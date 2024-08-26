import { toRecordSyncElement, toSyncElement } from '../utils';
import { AddPositionAction, AddViewAction, SharedType, SyncArrayElement, SyncMapElement, ViewActionName } from '../../types';
import { ActionName, AddFieldAction, AddRecordAction, AITableRecord, getDefaultFieldValue } from '@ai-table/grid';
import * as Y from 'yjs';

export default function addNode(
    sharedType: SharedType,
    action: AddFieldAction | AddRecordAction | AddViewAction | AddPositionAction
): SharedType {
    const records = sharedType.get('records')! as Y.Array<SyncArrayElement>;
    const views = sharedType.get('views') as Y.Array<SyncMapElement>;
    const fields = sharedType.get('fields')!;
    console.log(action);
    switch (action.type) {
        case ActionName.AddRecord:
            if (records && views) {
                records.push([toRecordSyncElement(action.record as AITableRecord)]);
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
            }
            break;
        case ViewActionName.AddPosition:
            if (views) {
                for (let value of views) {
                    let positions = value.get(action.key);
                    positions.insert(action.path[0], [action.node]);
                }
            }
            break;
    }

    return sharedType;
}
