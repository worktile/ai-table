import * as Y from 'yjs';
import translateArrayEvent from './array-event';
import translateMapEvent from './map-event';
import { YjsAITable } from '../yjs-table';
import { AITableSharedAction, AIViewTable, SharedType } from '../../types';

export function translateYjsEvent(aiTable: AIViewTable, activeViewId: string, sharedType: SharedType, event: Y.YEvent<any>): AITableSharedAction[] {
    if (event instanceof Y.YArrayEvent) {
        return translateArrayEvent(aiTable, activeViewId, sharedType, event);
    }
    if (event instanceof Y.YMapEvent) {
        return translateMapEvent(aiTable, activeViewId, sharedType, event);
    }
    return [];
}

export function applyEvents(aiTable: AIViewTable, activeViewId: string, sharedType: SharedType, events: Y.YEvent<any>[]) {
    events.forEach((event) =>
        translateYjsEvent(aiTable, activeViewId, sharedType, event).forEach((item: AITableSharedAction) => {
            console.log(item);
            aiTable.apply(item);
        })
    );
}

export function applyYjsEvents(aiTable: AIViewTable, activeViewId: string, sharedType: SharedType, events: Y.YEvent<any>[]): void {
    if (YjsAITable.isUndo(aiTable)) {

        applyEvents(aiTable, activeViewId, sharedType, events);
    } else {
        YjsAITable.asRemote(aiTable, () => {
            applyEvents(aiTable, activeViewId, sharedType, events);
        });
    }
}
