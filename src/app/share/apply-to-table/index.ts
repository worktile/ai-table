import * as Y from 'yjs';
import { AITable, AITableAction } from '@ai-table/grid';
import translateMapEvent from './map-event';

export function translateYjsEvent(aiTable: AITable, event: Y.YEvent<any>): AITableAction[] {
    // if (event instanceof Y.YArrayEvent) {
    //   return translateArrayEvent(editor, event);
    // }

    if (event instanceof Y.YMapEvent) {
        return translateMapEvent(aiTable, event);
    }

    // if (event instanceof Y.YTextEvent) {
    //   return translateTextEvent(editor, event);
    // }

    throw new Error('Unsupported yjs event');
}

export function applyYjsEvents(aiTable: AITable, events: Y.YEvent<any>[]): void {
    events.forEach((event) => translateYjsEvent(aiTable, event).forEach(aiTable.apply));
}
