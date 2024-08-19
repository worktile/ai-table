import {
    ActionName,
    AIFieldIdPath,
    AIFieldPath,
    AIFieldValueIdPath,
    AIRecordPath,
    AITableAction,
    AITableField,
    AITableQueries
} from '@ai-table/grid';
import * as Y from 'yjs';
import { isArray } from 'ngx-tethys/util';
import { AITableViewFields, AITableViewRecords, AIViewTable, SharedType } from '../../types';
import { translatePositionToPath, getShareTypeNumberPath } from '../utils';
import { getSharedMapValueId, getSharedRecordId, translateToRecordValues } from '../utils/translate';

export default function translateArrayEvent(aiTable: AIViewTable, sharedType: SharedType, event: Y.YEvent<any>): AITableAction[] {
    let offset = 0;
    let targetPath = getShareTypeNumberPath(event.path);
    const isRecordsTranslate = event.path.includes('records');
    const isFieldsTranslate = event.path.includes('fields');
    const actions: AITableAction[] = [];

    event.changes.delta.forEach((delta) => {
        if ('retain' in delta) {
            offset += delta.retain ?? 0;
        }

        if ('delete' in delta) {
            if (isAddOrRemove(targetPath)) {
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

        if ('insert' in delta) {
            if (isArray(delta.insert)) {
                if (isRecordsTranslate) {
                    if (isAddOrRemove(targetPath)) {
                        delta.insert?.map((item: Y.Array<any>) => {
                            const data = item.toJSON();
                            const [fixedField, customField] = data;
                            const activeViewId = aiTable.views().find((item) => item.is_active)!._id!;
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
                            delta.insert?.map((item: any) => {
                                const recordIndex = targetPath[0] as number;
                                const fieldIndex = offset;
                                const recordId = getSharedRecordId(sharedType.get('records')!, recordIndex);
                                const fieldId = getSharedMapValueId(sharedType.get('fields')!, fieldIndex);
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
                            });
                        } catch (error) {}
                    }
                }
                if (isFieldsTranslate) {
                    delta.insert?.map((item: Y.Map<any>) => {
                        const data = item.toJSON();
                        if (event.path.includes('fields')) {
                            const activeViewId = aiTable.views().find((item) => item.is_active)!._id!;
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
                        }
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
