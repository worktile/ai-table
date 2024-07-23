import { ActionName, AITable, AITableAction, AITableField, AITableRecord } from '@ai-table/grid';
import * as Y from 'yjs';
import { toTablePath, translateRecord } from '../utils/translate-to-table';
import { isArray } from 'ngx-tethys/util';

export default function translateArrayEvent(aiTable: AITable, event: Y.YEvent<any>): AITableAction[] {
    const actions: AITableAction[] = [];

    let offset = 0;
    event.changes.delta.forEach((delta) => {
        if ('retain' in delta) {
            offset += delta.retain ?? 0;
        }
        if ('insert' in delta) {
            if (isArray(delta.insert)) {
                delta.insert?.map((item: Y.Map<any>, index) => {
                    const data = item.toJSON();
                    if (event.path.includes('fields')) {
                        actions.push({
                            type: ActionName.AddField,
                            path: [offset + index],
                            field: {
                                ...(data as AITableField),
                                type: Number(data['type'])
                            }
                        });
                    }
                    if (event.path.includes('records')) {
                        // To exclude insertions triggered by column inserts, handle only whole record insertions.
                        const path = toTablePath(event.path);
                        if (!path.length) {
                            const value = item.get('value').toJSON();
                            actions.push({
                                type: ActionName.AddRecord,
                                path: [offset + index],
                                record: {
                                    ...(data as AITableRecord),
                                    value: translateRecord(value)
                                }
                            });
                        }
                    }
                });
            }
        }
    });

    return actions;
}
