import * as Y from 'yjs';
import translateArrayEvent from './array-event';
import translateMapEvent from './map-event';
import { SharedAITable, AITableSharedAction } from 'dist/share';
import { YjsAITable } from '../yjs-table';

export function translateYjsEvent(aiTable: SharedAITable, event: Y.YEvent<any>): AITableSharedAction[] {
    if (event instanceof Y.YArrayEvent) {
        return translateArrayEvent(aiTable, event);
    }
    if (event instanceof Y.YMapEvent) {
        return translateMapEvent(aiTable, event);
    }
    return [];
}

export function applyEvents(aiTable: SharedAITable, events: Y.YEvent<any>[]) {
    events.forEach((event) =>
        translateYjsEvent(aiTable, event).forEach((item: AITableSharedAction) => {
            aiTable.apply(item);
        })
    );
}

export function applyYjsEvents(aiTable: SharedAITable, events: Y.YEvent<any>[]): void {
    if (YjsAITable.isUndo(aiTable)) {
        applyEvents(aiTable, events);
    } else {
        YjsAITable.asRemote(aiTable, () => {
            applyEvents(aiTable, events);
        });
    }
}
