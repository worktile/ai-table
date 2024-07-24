import { ActionName, AIFieldValuePath, AITable, AITableAction, AITableField, AITableQueries } from '@ai-table/grid';
import * as Y from 'yjs';
import { toTablePath, translateRecord } from '../utils/translate-to-table';
import { isArray } from 'ngx-tethys/util';

export default function translateArrayEvent(aiTable: AITable, event: Y.YEvent<any>): AITableAction[] {
    const actions: AITableAction[] = [];
    let offset = 0;
    let targetPath = toTablePath(event.path);
    const isRecordsTranslate = event.path.includes('records');
    const isFieldsTranslate = event.path.includes('fields');

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
                                const path = [targetPath[0], offset - 1] as AIFieldValuePath;
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
                        delta.insert?.map((item: Y.Array<any>, index) => {
                            const data = item.toJSON();
                            actions.push({
                                type: ActionName.AddRecord,
                                path: [offset + index],
                                record: {
                                    id: data[0],
                                    value: translateRecord(data, aiTable.fields())
                                }
                            });
                        });
                    }
                }
                if (isFieldsTranslate) {
                    delta.insert?.map((item: Y.Map<any>, index) => {
                        const data = item.toJSON();
                        if (event.path.includes('fields')) {
                            actions.push({
                                type: ActionName.AddField,
                                path: [offset + index],
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
