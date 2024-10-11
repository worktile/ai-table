import { AITableField } from '@ai-table/grid';
import * as Y from 'yjs';
import { getShareTypeNumberPath } from '../utils';
import { ActionName, AITableAction, AITableView, AIViewTable, SharedType, SyncMapElement } from '../../types';

export default function translateMapEvent(
    aiTable: AIViewTable,
    sharedType: SharedType,
    event: Y.YMapEvent<unknown>
): AITableAction[] {
    const isFieldsTranslate = event.path.includes('fields');
    const isViewTranslate = event.path.includes('views');

    if (isViewTranslate || isFieldsTranslate) {
        let [targetPath] = getShareTypeNumberPath(event.path) as [number];
        let targetElement;
        const targetSyncElement = event.target as SharedType;
        if (isFieldsTranslate) {
            const field = sharedType.get('fields')?.get(targetPath) as SyncMapElement;
            const fieldId = field && field.get('_id');
            targetElement = fieldId && aiTable.fields().find((item) => item._id === field.get('_id'));
        }

        if (isViewTranslate) {
            targetElement = aiTable.views()[targetPath];
        }

        if (targetElement) {
            const keyChanges: [string, { action: 'add' | 'update' | 'delete'; oldValue: any }][] = Array.from(event.changes.keys.entries());
            const newProperties: Partial<AITableView | AITableField> = {};
            const properties: Partial<AITableView | AITableField> = {};

            const entries: [string, any][] = keyChanges.map(([key, info]) => {
                const value = targetSyncElement.get(key);
                return [key, info.action === 'delete' ? null : value instanceof Y.AbstractType ? value.toJSON() : value];
            });

            for (const [key, value] of entries) {
                const k = key as keyof (AITableView | AITableField);
                newProperties[k] = value;
            }

            const oldEntries = keyChanges.map(([key]) => [key, (targetElement as any)[key]]);
            for (const [key, value] of oldEntries) {
                const k = key as keyof (AITableView | AITableField);
                properties[k] = value;
            }
            const type = isFieldsTranslate ? ActionName.SetField : ActionName.SetView;
            return [
                {
                    type,
                    properties: properties,
                    newProperties: newProperties,
                    path: [targetElement._id]
                }
            ] as AITableAction[];
        }
    }
    return [];
}
