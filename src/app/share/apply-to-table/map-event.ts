import { ActionName, AIFieldValuePath, AITable, AITableAction, AITableQueries, Path } from '@ai-table/grid';
import * as Y from 'yjs';
import { toTablePath } from '../utils/translate-to-table';

export default function translateMapEvent(aiTable: AITable, event: Y.YEvent<any>): AITableAction[] {
    const path = toTablePath(event.path) as AIFieldValuePath;
    if (path.length) {
        const targetSyncElement = event.target;
        const targetElement = AITableQueries.getFieldValue(aiTable, path);
        const fieldValue = targetElement;
        const keyChanges = Array.from(event.changes.keys.entries());
        const newFieldValue = (<any>Object).fromEntries(
            keyChanges.map(([key, info]) => [key, info.action === 'delete' ? null : targetSyncElement.get(key)])
        ).fieldValue;
        return [
            {
                type: ActionName.UpdateFieldValue,
                path,
                fieldValue,
                newFieldValue
            }
        ];
    }
    return []
}
