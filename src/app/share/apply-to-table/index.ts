import * as Y from 'yjs';
import { AITable, AITableAction } from '@ai-table/grid';
import translateMapEvent from './map-event';
import translateArrayEvent from './array-event';
import { YjsAITable } from '../yjs-table';

export function translateYjsEvent(aiTable: AITable, event: Y.YEvent<any>): AITableAction[] {
    if (event instanceof Y.YArrayEvent) {
        return translateArrayEvent(aiTable, event);
    }

    if (event instanceof Y.YMapEvent) {
        return translateMapEvent(aiTable, event);
    }


    throw new Error('Unsupported yjs event');
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
