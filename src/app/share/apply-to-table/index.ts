import * as Y from 'yjs';
import { AITable, AITableAction } from '@ai-table/grid';
import translateArrayEvent, { translateSubArrayEvent } from './array-event';
import { YjsAITable } from '../yjs-table';
import { AIViewAction, AIViewTable } from '../../types/view';
import translateMapEvent from './map-event';
import { LiveBlockProvider } from '../live-block-provider';

export function translateYjsEvent(aiTable: AITable, event: Y.YEvent<any>): AITableAction[] | AIViewAction[] {
    if (event instanceof Y.YArrayEvent) {
        return translateArrayEvent(aiTable, event);
    }
    if (event instanceof Y.YMapEvent) {
        return translateMapEvent(aiTable, event);
    }
    return [];
}

export function applyEvents(aiTable: AITable, events: Y.YEvent<any>[]) {
    events.forEach((event) =>
        translateYjsEvent(aiTable, event).forEach((item: AIViewAction | AITableAction) => {
            if (item.type === 'set_view') {
                (aiTable as AIViewTable).viewApply(item);
            } else {
                aiTable.apply(item);
            }
        })
    );
}

export function applyYjsEvents(aiTable: AITable, events: Y.YEvent<any>[]): void {
    if (YjsAITable.isUndo(aiTable)) {
        applyEvents(aiTable, events);
    } else {
        YjsAITable.asRemote(aiTable, () => {
            applyEvents(aiTable, events);
        });
    }
}

export function applySubDocEvents(liveBlock: LiveBlockProvider, aiTable: AITable, events: Y.YEvent<any>[]): void {
    if (YjsAITable.isUndo(aiTable)) {
        applyEvents(aiTable, events);
    } else {
        YjsAITable.asRemote(aiTable, () => {
            events.forEach((event) => {
                if (event instanceof Y.YArrayEvent) {
                    const actions = translateSubArrayEvent(liveBlock, aiTable, event);
                    actions.forEach((action: AIViewAction | AITableAction) => {
                        if (action.type === 'set_view') {
                            (aiTable as AIViewTable).viewApply(action);
                        } else {
                            aiTable.apply(action);
                        }
                    });
                }
            });
        });
    }
}
