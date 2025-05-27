import * as Y from 'yjs';
import {
    ActionName,
    AIRecordFieldIdPath,
    AITableAction,
    AITableField,
    AITableView,
    IdPath,
    Positions,
    SetRecordPositionAction,
    SharedType,
    SyncArrayElement,
    SyncMapElement
} from '../../types';
import {
    getIdBySystemFieldValues,
    getPositionsBySystemFieldValues,
    getSharedMapId,
    getSharedMapValueId,
    getSharedRecord,
    getSharedRecordId,
    getShareTypeNumberPath,
    getShortIdBySystemFieldValues,
    getTrackableEntityBySystemFieldValues,
    getValuesByCustomFieldValues
} from '../utils';
import { isArray } from 'lodash';
import { SystemFieldIndex } from '../../constants';

export function translateArrayEvent(sharedType: SharedType, event: Y.YEvent<any>): AITableAction[] {
    let offset = 0;
    let targetPath = getShareTypeNumberPath(event.path);
    const isRecordsTranslate = event.path.includes('records');
    const isFieldsTranslate = event.path.includes('fields');
    const isViewsTranslate = event.path.includes('views');
    const actions: AITableAction[] = [];

    event.changes.delta.forEach((delta) => {
        if ('retain' in delta) {
            offset += delta.retain ?? 0;
        }

        if ('delete' in delta) {
            if (isAddOrRemove(targetPath)) {
                if (isViewsTranslate) {
                    const removeIds = getRemoveIds(event, ActionName.RemoveView);
                    if (removeIds.length > 0) {
                        removeIds.forEach((path) => {
                            actions.push({
                                type: ActionName.RemoveView,
                                path
                            });
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
                        delta.insert?.map((item: Y.Array<any>, index) => {
                            const data = item.toJSON();
                            const [systemFieldValues, customFieldValues] = data;
                            const sharedFields = sharedType.get('fields')! as Y.Array<SyncMapElement>;
                            const fields = sharedFields.map((fieldElement: SyncMapElement) => {
                                return { _id: getSharedMapId(fieldElement) };
                            });
                            actions.push({
                                type: ActionName.AddRecord,
                                record: {
                                    _id: getIdBySystemFieldValues(systemFieldValues),
                                    short_id: getShortIdBySystemFieldValues(systemFieldValues),
                                    ...getTrackableEntityBySystemFieldValues(systemFieldValues),
                                    positions: getPositionsBySystemFieldValues(systemFieldValues),
                                    values: getValuesByCustomFieldValues(customFieldValues, fields)
                                }
                            });
                        });
                    } else {
                        try {
                            const sharedRecords = sharedType.get('records')! as Y.Array<SyncArrayElement>;
                            const sharedFields = sharedType.get('fields')! as Y.Array<SyncMapElement>;
                            delta.insert?.map((item: any, index: number) => {
                                const recordIndex = targetPath[0] as number;
                                const fieldIndex = offset + index;
                                const recordId = getSharedRecordId(sharedRecords, recordIndex);
                                // targetPath[0] 是记录的索引，targetPath[1] 表达式系统字段还是自定义字段（0代表系统字段，1代表自定义字段）
                                // yjs 中 record 的存储结构是 [systemFieldValues, customFieldValues]
                                if (isSystemFieldOperation(targetPath)) {
                                    if (isPositionsOperation(fieldIndex)) {
                                        const newPositions: Positions = {};
                                        for (const key in item) {
                                            newPositions[key] = item[key];
                                        }
                                        const action: SetRecordPositionAction = {
                                            type: ActionName.SetRecordPositions,
                                            path: [recordIndex],
                                            positions: newPositions
                                        };
                                        actions.push(action);
                                    } else if (isUpdatedByOperation(fieldIndex)) {
                                        // 此处的循环会包含 updated_at 和 updated_by 各一次，这里只处理 updated_by 同时包含两个字段的修改
                                        const systemFieldValues = getSharedRecord(sharedRecords, recordIndex).get(0).toJSON();
                                        const { updated_at, updated_by } = getTrackableEntityBySystemFieldValues(systemFieldValues);
                                        actions.push({
                                            type: ActionName.UpdateSystemFieldValue,
                                            path: [recordId],
                                            updatedInfo: { updated_at: updated_at as number, updated_by }
                                        });
                                    }
                                } else {
                                    const fieldId = getSharedMapValueId(sharedFields, fieldIndex);
                                    const path = [recordId, fieldId] as AIRecordFieldIdPath;
                                    actions.push({
                                        type: ActionName.UpdateFieldValue,
                                        path,
                                        newFieldValue: item
                                    });
                                }
                            });
                        } catch (error) {}
                    }
                }
                if (isFieldsTranslate) {
                    delta.insert?.map((item: Y.Map<any>, index) => {
                        const data = item.toJSON();
                        actions.push({
                            type: ActionName.AddField,
                            field: data as AITableField
                        });
                    });
                }
                if (isViewsTranslate) {
                    delta.insert?.map((item: Y.Map<any>, index) => {
                        const data = item.toJSON();
                        actions.push({
                            type: ActionName.AddView,
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

export function isSystemFieldOperation(targetPath: number[]): boolean {
    if (targetPath.length === 2 && targetPath[1] === 0) {
        return true;
    }
    return false;
}

export function isCustomFieldOperation(targetPath: number[]): boolean {
    if (targetPath.length === 2 && targetPath[1] === 1) {
        return true;
    }
    return false;
}

export function isPositionsOperation(fieldIndex: number): boolean {
    return fieldIndex === SystemFieldIndex.Positions;
}

export function isUpdatedByOperation(fieldIndex: number): boolean {
    return fieldIndex === SystemFieldIndex.UpdatedBy;
}

export function getRemoveIds(event: Y.YEvent<any>, type: ActionName.RemoveField | ActionName.RemoveRecord | ActionName.RemoveView) {
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
                if ((type === ActionName.RemoveField || type === ActionName.RemoveView) && item.parentSub === '_id') {
                    ids.push(item.content.getContent() as IdPath);
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
