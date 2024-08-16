import { ActionName, AITable, AITableField } from '@ai-table/grid';
import * as Y from 'yjs';
import { getShareTypeNumberPath } from '../utils';
import { AITableSharedAction, AITableView, SharedType, ViewActionName } from '../../types';

export default function translateMapEvent(aiTable: AITable, sharedType: SharedType, event: Y.YMapEvent<unknown>): AITableSharedAction[] {
    const isFieldsTranslate = event.path.includes('fields');
    const isViewTranslate = event.path.includes('views');

    if (isViewTranslate || isFieldsTranslate) {
        let [targetPath] = getShareTypeNumberPath(event.path) as [number];
        const targetSyncElement = event.target as SharedType;
        const sharedElement = isFieldsTranslate ? sharedType.get('fields')?.get(targetPath) : sharedType.get('views')?.get(targetPath);
        const targetElement = sharedElement?.toJSON() as AITableField | AITableView;
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
            let type = isFieldsTranslate ? ActionName.SetField : ViewActionName.setView;
            // TODO:
            // 排序、筛选等操作仅对当前视图生效，修改名称、修改视图顺序等操作对所有视图生效，后续需要做区分
            // 考虑将排序和筛选等操作从 set_view 中移出
            return [
                {
                    type,
                    properties: properties,
                    newProperties: newProperties,
                    path: [targetElement._id]
                }
            ];
        }
    }
    return [];
}
