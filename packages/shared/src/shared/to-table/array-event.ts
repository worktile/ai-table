import { ActionName, AIFieldPath, AIFieldValuePath, AIRecordPath, AITableAction, AITableField, AITableQueries } from '@ai-table/grid';
import * as Y from 'yjs';
import { isArray } from 'ngx-tethys/util';
import { toTablePath, translateRecord } from '../utils';
import { AITableViewFields, AIViewTable, SharedType } from '../../types';

export default function translateArrayEvent(aiTable: AIViewTable, sharedType: SharedType, event: Y.YEvent<any>): AITableAction[] {
    let offset = 0;
    let targetPath = toTablePath(event.path);
    const isRecordsTranslate = event.path.includes('records');
    const isFieldsTranslate = event.path.includes('fields');
    const actions: AITableAction[] = [];

    event.changes.delta.forEach((delta) => {
        if ('retain' in delta) {
            offset += delta.retain ?? 0;
        }
        if ('insert' in delta) {
            if (isArray(delta.insert)) {
                if (isRecordsTranslate) {
                    if (targetPath.length) {
                        try {
                            delta.insert?.map((item: any) => {
                                const path = [targetPath[0], offset] as AIFieldValuePath;
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
                    } else {
                        delta.insert?.map((item: Y.Array<any>) => {
                            const data = item.toJSON();
                            const [fixedField, customField] = data;
                            const activeView = aiTable.views().find((item) => item.isActive)!;
                            const path = [customField[customField.length - 1][activeView._id]] as AIRecordPath;

                            actions.push({
                                type: ActionName.AddRecord,
                                path,
                                record: {
                                    _id: fixedField[0],
                                    values: translateRecord(customField, aiTable.fields() as AITableViewFields)
                                }
                            });
                        });
                    }
                }
                if (isFieldsTranslate) {
                    delta.insert?.map((item: Y.Map<any>) => {
                        const data = item.toJSON();
                        if (event.path.includes('fields')) {
                            const activeView = aiTable.views().find((item) => item.isActive)!;
                            const path = [data['positions'][activeView._id]] as AIFieldPath;
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
