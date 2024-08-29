import { toRecordSyncElement, toSyncElement } from '../utils';
import {
    AddRecordPositionAction,
    AddViewAction,
    AITableViewRecord,
    PositionActionName,
    SharedType,
    SyncArrayElement,
    SyncMapElement,
    ViewActionName
} from '../../types';
import { ActionName, AddFieldAction, AddRecordAction, getDefaultFieldValue } from '@ai-table/grid';
import * as Y from 'yjs';

export default function addNode(
    sharedType: SharedType,
    action: AddFieldAction | AddRecordAction | AddViewAction | AddRecordPositionAction
): SharedType {
    const records = sharedType.get('records')! as Y.Array<SyncArrayElement>;
    const views = sharedType.get('views')!;
    const fields = sharedType.get('fields')! as Y.Array<SyncMapElement>;
    switch (action.type) {
        case ActionName.AddRecord:
            records && records.push([toRecordSyncElement(action.record as AITableViewRecord)]);
            break;
        case ViewActionName.AddView:
            views && views.push([toSyncElement(action.view)]);
            break;
        case PositionActionName.AddRecordPosition:
            if (records) {
                for (let value of records) {
                    const id = value.get(0).get(0)['_id'];
                    const customField = value.get(1) as Y.Array<any>;
                    const positionsIndex = customField.length - 1;
                    const positions = customField.get(positionsIndex);
                    const newPositions = { ...positions, [action.path[0]]: action.positions[id] };
                    customField.delete(positionsIndex);
                    customField.insert(positionsIndex, [newPositions]);
                }
            }
            break;
        case ActionName.AddField:
            if (fields && records) {
                fields.push([toSyncElement(action.field)]);
                const path = action.path[0];
                for (let value of records) {
                    const newRecord = getDefaultFieldValue(action.field);
                    const customField = value.get(1);
                    customField.insert(path, [newRecord]);
                }
            }
            break;
    }

    return sharedType;
}
