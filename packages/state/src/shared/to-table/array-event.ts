import { ActionName, AIFieldIdPath, AIFieldPath, AIFieldValueIdPath, AIRecordPath, AITableField, AITableQueries } from '@ai-table/grid';
import { isArray } from 'ngx-tethys/util';
import * as Y from 'yjs';
import {
    AITableSharedAction,
    AITableView,
    AITableViewFields,
    AITableViewRecords,
    AIViewTable,
    PositionActionName,
    SharedType,
    SyncArrayElement,
    SyncMapElement,
    ViewActionName
} from '../../types';
import { getShareTypeNumberPath, translatePositionToPath } from '../utils';
import { getSharedMapValueId, getSharedRecordId, translateToRecordValues } from '../utils/translate';

export default function translateArrayEvent(aiTable: AIViewTable, sharedType: SharedType, event: Y.YEvent<any>): AITableSharedAction[] {
    let offset = 0;
    let targetPath = getShareTypeNumberPath(event.path);
    const isRecordsTranslate = event.path.includes('records');
    const isFieldsTranslate = event.path.includes('fields');
    const isViewsTranslate = event.path.includes('views');
    const actions: AITableSharedAction[] = [];
    const activeViewId = aiTable.activeViewId();

    event.changes.delta.forEach((delta) => {
        if ('retain' in delta) {
            offset += delta.retain ?? 0;
        }

        if ('delete' in delta) {
            if (isAddOrRemove(targetPath)) {
                if (isViewsTranslate) {
                    const removeView = aiTable.views()[offset];
                    if (removeView) {
                        actions.push({
                            type: ViewActionName.RemoveView,
                            path: [removeView._id]
                        });
                    }
                } else {
                    const type = isRecordsTranslate ? ActionName.RemoveRecord : ActionName.RemoveField;
                    const removeIds = getRemoveIds(event, type);
                    if (removeIds.length) {
                        removeIds.forEach((path) => {
                            actions.push({
                                type,
                                path
                            });
                        });
                    }
                }
            }
        }

        if ('insert' in delta) {
            if (isArray(delta.insert)) {
                if (isRecordsTranslate) {
                    if (isAddOrRemove(targetPath)) {
                        delta.insert?.map((item: Y.Array<any>) => {
                            const data = item.toJSON();
                            const [fixedField, customField] = data;
                            const position = customField[customField.length - 1][activeViewId];
                            const path = translatePositionToPath(
                                aiTable.records() as AITableViewRecords,
                                position,
                                activeViewId
                            ) as AIRecordPath;

                            actions.push({
                                type: ActionName.AddRecord,
                                path: path,
                                record: {
                                    _id: fixedField[0]['_id'],
                                    values: translateToRecordValues(customField, aiTable.fields() as AITableViewFields)
                                }
                            });
                        });
                    } else {
                        try {
                            const sharedRecords = sharedType.get('records')! as Y.Array<SyncArrayElement>;
                            const sharedFields = sharedType.get('fields')! as Y.Array<SyncMapElement>;
                            delta.insert?.map((item: any) => {
                                const recordIndex = targetPath[0] as number;
                                const fieldIndex = offset;
                                const record = (aiTable.records() as AITableViewRecords)[recordIndex];
                                if (isPositionOperation(fieldIndex, sharedFields)) {
                                    for (const key in item) {
                                        if (!record.positions[key] && record.positions[key] !== 0) {
                                            actions.push({
                                                type: PositionActionName.AddRecordPosition,
                                                path: [record._id],
                                                position: {
                                                    [key]: item[key]
                                                }
                                            });
                                        }
                                    }
                                    for (const key in record.positions) {
                                        if (!item[key] && item[key] !== 0) {
                                            actions.push({
                                                type: PositionActionName.RemoveRecordPosition,
                                                path: [key, record._id]
                                            });
                                        }
                                    }
                                } else {
                                    const recordId = getSharedRecordId(sharedRecords, recordIndex);
                                    const fieldId = getSharedMapValueId(sharedFields, fieldIndex);
                                    const path = [recordId, fieldId] as AIFieldValueIdPath;
                                    const fieldValue = AITableQueries.getFieldValue(aiTable, path);

                                    // To exclude insert triggered by field inserts.
                                    if (fieldValue !== item) {
                                        actions.push({
                                            type: ActionName.UpdateFieldValue,
                                            path,
                                            fieldValue,
                                            newFieldValue: item
                                        });
                                    }
                                }
                            });
                        } catch (error) {}
                    }
                }
                if (isFieldsTranslate) {
                    delta.insert?.map((item: Y.Map<any>) => {
                        const data = item.toJSON();
                        const path = translatePositionToPath(
                            aiTable.fields() as AITableViewFields,
                            data['positions'][activeViewId],
                            activeViewId
                        ) as AIFieldPath;
                        actions.push({
                            type: ActionName.AddField,
                            path,
                            field: data as AITableField
                        });
                    });
                }
                if (isViewsTranslate) {
                    delta.insert?.map((item: Y.Map<any>, index) => {
                        const data = item.toJSON();
                        actions.push({
                            type: ViewActionName.AddView,
                            path: [offset + index],
                            view: data as AITableView
                        });
                    });
                }
            }
        }
    });
    return actions;
}

export function isAddOrRemove(targetPath: number[]): boolean {
    return targetPath.length === 0;
}

export function isPositionOperation(fieldIndex: number, sharedFields: Y.Array<SyncMapElement>): boolean {
    return fieldIndex === sharedFields.length;
}

export function getRemoveIds(event: Y.YEvent<any>, type: ActionName.RemoveField | ActionName.RemoveRecord) {
    const ids: [string][] = [];
    if (!type) {
        return ids;
    }

    Y.iterateDeletedStructs(
        event.transaction,
        event.transaction.deleteSet,
        // @param {Item|GC} item
        (item) => {
            if (item instanceof Y.Item && item.deleted) {
                if (type === ActionName.RemoveField && item.parentSub === '_id') {
                    ids.push(item.content.getContent() as AIFieldIdPath);
                }
                if (type === ActionName.RemoveRecord) {
                    const content = item.content.getContent();
                    if (content[0] && content[0]['_id']) {
                        ids.push([content[0]['_id']]);
                    }
                }
            }
        }
    );
    return ids;
}
