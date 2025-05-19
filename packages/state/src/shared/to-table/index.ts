import * as Y from 'yjs';
import { AIViewTable } from '../../types';
import { YjsAITable } from '../yjs-table';
import translateMapEvent from './map-event';
import { AITableAction, SharedType, translateArrayEvent } from '@ai-table/utils';

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
    const actions: AITableAction[] = [];
    events.forEach((event) =>
        translateYjsEvent(aiTable, sharedType, event).forEach((item: AITableAction) => {
            actions.push(item);
        })
    );
    return actions;
}

export function applyYjsEvents(aiTable: AIViewTable, sharedType: SharedType, events: Y.YEvent<any>[]): void {
    if (YjsAITable.isUndo(aiTable)) {
        const actions = applyEvents(aiTable, sharedType, events);
        applyActions(actions, aiTable);
    } else {
        YjsAITable.asRemote(aiTable, () => {
            const actions = applyEvents(aiTable, sharedType, events);
            applyActions(actions, aiTable);
        });
    }
}

export function applyActions(actions: AITableAction[], aiTable: AIViewTable) {
    aiTable.apply(actions);
}
