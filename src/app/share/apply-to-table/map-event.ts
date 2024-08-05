import { AITable, AITableAction } from "@ai-table/grid";
import * as Y from 'yjs';
import { AITableView, AIViewAction, AIViewTable, ViewActionName } from "../../types/view";
import { toTablePath } from "../utils/translate-to-table";
import { SharedType } from "../shared";

export default function translateMapEvent(
    aiTable: AITable,
    event: Y.YMapEvent<unknown>
): AIViewAction[] | AITableAction[] {
    const isViewTranslate = event.path.includes('views')
    if (isViewTranslate) {
        let [targetPath] = toTablePath(event.path) as [number];
        const targetSyncElement = event.target as SharedType;
        const targetElement = (aiTable as AIViewTable).views()[targetPath]
        const keyChanges: [string, { action: 'add' | 'update' | 'delete', oldValue: any }][] = Array.from(event.changes.keys.entries());
        const newProperties:Partial<AITableView> = {};
        const properties:Partial<AITableView> = {};

        const entries:[string, any][] = keyChanges.map(([key, info]) => {
            const value = targetSyncElement.get(key);
            return [
                key,
                info.action === 'delete' ? null : value instanceof Y.AbstractType ? value.toJSON() : value
            ]
        })

        for (const [key, value] of entries) {
            const k = key;
            newProperties[k] = value  
        }

        const oldEntries = keyChanges.map(([key]) => [key, (targetElement as any)[key]])

        for (const [key, value] of oldEntries) {
            const k = key;
            properties[k] = value
        }

        return [{ type: ViewActionName.setView, view: properties, newView: newProperties, path: [targetPath] }];

    }
    return []
}

