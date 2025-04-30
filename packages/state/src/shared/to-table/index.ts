import * as Y from 'yjs';
import { AITableAction, AIViewTable } from '../../types';
import { YjsAITable } from '../yjs-table';
import translateMapEvent from './map-event';
import { SharedType } from '@ai-table/utils';
import { translateArrayEvent } from '@ai-table/utils';

export function translateYjsEvent(aiTable: AIViewTable, sharedType: SharedType, event: Y.YEvent<any>): AITableAction[] {
    if (event instanceof Y.YArrayEvent) {
        return translateArrayEvent(sharedType, event);
    }
    if (event instanceof Y.YMapEvent) {
        return translateMapEvent(aiTable, sharedType, event);
    }
    return [];
}

export function applyEvents(aiTable: AIViewTable, sharedType: SharedType, events: Y.YEvent<any>[]) {
    events.forEach((event) =>
        translateYjsEvent(aiTable, sharedType, event).forEach((item: AITableAction) => {
            aiTable.apply(item);
        })
    );
}

export function applyYjsEvents(aiTable: AIViewTable, sharedType: SharedType, events: Y.YEvent<any>[]): void {
    if (YjsAITable.isUndo(aiTable)) {
        applyEvents(aiTable, sharedType, events);
    } else {
        YjsAITable.asRemote(aiTable, () => {
            applyEvents(aiTable, sharedType, events);
        });
    }
}
