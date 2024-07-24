import * as Y from 'yjs';
import { AITable, AITableAction } from '@ai-table/grid';
import translateArrayEvent from './array-event';
import { YjsAITable } from '../yjs-table';

export function translateYjsEvent(aiTable: AITable, event: Y.YEvent<any>): AITableAction[] {
    if (event instanceof Y.YArrayEvent) {
        return translateArrayEvent(aiTable, event);
    }
    return [];
}

export function applyYjsEvents(aiTable: AITable, events: Y.YEvent<any>[]): void {
    if (YjsAITable.isUndo(aiTable)) {
        events.forEach((event) =>
            translateYjsEvent(aiTable, event).forEach((item) => {
                aiTable.apply(item);
            })
        );
    } else {
        YjsAITable.asRemote(aiTable, () => {
            events.forEach((event) =>
                translateYjsEvent(aiTable, event).forEach((item) => {
                    aiTable.apply(item);
                })
            );
        });
    }
}
