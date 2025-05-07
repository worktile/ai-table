import { AITable } from '@ai-table/grid';
import * as Y from 'yjs';
import {
    ActionName,
    AddFieldAction,
    AddRecordAction,
    SetRecordPositionAction,
    AddViewAction,
    UpdateSystemFieldValue,
    getPositionsByRecordSyncElement,
    getSharedRecordIndex,
    setRecordPositions,
    getIdBySystemFieldValuesType,
    setRecordUpdatedInfo,
    toRecordSyncElement,
    toMapSyncElement,
    AITableViewFields,
    AITableViewRecord,
    SharedType,
    SyncArrayElement,
    SyncMapElement
} from '@ai-table/utils';

export default function addNode(
    aiTable: AITable,
    sharedType: SharedType,
    action: AddFieldAction | AddRecordAction | AddViewAction | SetRecordPositionAction | UpdateSystemFieldValue
): SharedType {
    const records = sharedType.get('records')! as Y.Array<SyncArrayElement>;
    const views = sharedType.get('views')!;
    const fields = sharedType.get('fields')! as Y.Array<SyncMapElement>;
    switch (action.type) {
        case ActionName.AddRecord:
            records && records.push([toRecordSyncElement(action.record as AITableViewRecord, aiTable.fields() as AITableViewFields)]);
            break;
        case ActionName.AddView:
            views && views.push([toMapSyncElement(action.view)]);
            break;
        case ActionName.SetRecordPositions:
            if (records) {
                const recordIndex = getSharedRecordIndex(records, action.path[0]);
                const record = records.get(recordIndex);
                const positions = getPositionsByRecordSyncElement(record);
                const newPositions = { ...positions };
                for (const key in action.positions) {
                    if (action.positions[key] === null || action.positions[key] === undefined) {
                        delete newPositions[key];
                    } else {
                        newPositions[key] = action.positions[key];
                    }
                }
                setRecordPositions(record, newPositions);
            }
            break;
        case ActionName.UpdateSystemFieldValue:
            if (records) {
                const recordIndex = getSharedRecordIndex(records, action.path[0]);
                const record = records.get(recordIndex);
                if (action.updatedInfo.updated_at && action.updatedInfo.updated_by) {
                    setRecordUpdatedInfo(record, action.updatedInfo as { updated_at: number; updated_by: string });
                }
            }
            break;
        case ActionName.AddField:
            if (fields && records) {
                const { field } = action;
                const insertIndex = fields.length;
                const fieldSyncElement = toMapSyncElement(field);
                fields.insert(insertIndex, [fieldSyncElement]);
                for (let value of records) {
                    const customFieldValues = value.get(1) as Y.Array<any>;
                    const systemFieldValues = value.get(0);
                    const recordEntity = aiTable.recordsMap()[getIdBySystemFieldValuesType(systemFieldValues)];
                    const newFieldValue = recordEntity.values[action.field._id];
                    // 幽灵单元格，暂不处理交给后端统一处理
                    if (insertIndex <= customFieldValues.length) {
                        customFieldValues.insert(insertIndex, [newFieldValue]);
                    } else {
                        console.error('Field index out of bounds, cannot initialize record value for new field');
                    }
                }
            }
            break;
    }

    return sharedType;
}
