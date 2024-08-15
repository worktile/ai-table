import { ActionName, AIFieldValuePath, AITable, AITableAction, AITableField, AITableQueries } from '@ai-table/grid';
import * as Y from 'yjs';
import { isArray } from 'ngx-tethys/util';
import { getTableIndex } from '../utils';
import { AITableViewFields, SharedType } from '../../types';
import { getSharedFieldId, getSharedRecordId, translateToRecordValues } from '../utils/translate';

export default function translateArrayEvent(aiTable: AITable, sharedType: SharedType, event: Y.YEvent<any>): AITableAction[] {
    const actions: AITableAction[] = [];
    let offset = 0;
    let targetPath = getTableIndex(event.path);
    const isRecordsTranslate = event.path.includes('records');
    const isFieldsTranslate = event.path.includes('fields');

    event.changes.delta.forEach((delta) => {
        if ('retain' in delta) {
            offset += delta.retain ?? 0;
        }
        if ('insert' in delta) {
            if (isArray(delta.insert)) {
                if (isRecordsTranslate) {
                    if (isAddRecord(targetPath)) {
                        try {
                            delta.insert?.map((item: any) => {
                                const recordIndex = targetPath[0] as number;
                                const fieldIndex = offset;
                                const recordId = getSharedRecordId(sharedType.get('records')!, recordIndex);
                                const fieldId = getSharedFieldId(sharedType.get('fields')!, fieldIndex);
                                const path = [recordId, fieldId] as AIFieldValuePath;
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
                            const [fixedField, customField] = data;
                            actions.push({
                                type: ActionName.AddRecord,
                                path: [offset + index],
                                record: {
                                    _id: fixedField[0],
                                    values: translateToRecordValues(customField, aiTable.fields() as AITableViewFields)
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

export function isAddRecord(targetPath: number[]): boolean {
    return targetPath.length !== 0;
}
