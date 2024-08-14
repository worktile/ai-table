import * as Y from 'yjs';
import translateArrayEvent from './array-event';
import translateMapEvent from './map-event';
import { YjsAITable } from '../yjs-table';
import { AITableSharedAction, AITableView, AITableViewField, AIViewTable, SharedType } from '../../types';
import { ActionName } from '@ai-table/grid';

export function translateYjsEvent(aiTable: AIViewTable, event: Y.YEvent<any>): AITableSharedAction[] {
    if (event instanceof Y.YArrayEvent) {
        return translateArrayEvent(aiTable, event);
    }
    if (event instanceof Y.YMapEvent) {
        return translateMapEvent(aiTable, event);
    }
    return [];
}

export function applyEvents(aiTable: AIViewTable, sharedType: SharedType, activeView: AITableView, events: Y.YEvent<any>[]) {
    events.forEach((event) =>
        translateYjsEvent(aiTable, event).forEach((item: AITableSharedAction) => {
            if (item.type === ActionName.AddRecord) {
                const records = sharedType.get('records')?.toJSON();
                const record = records?.find((record) => record[0][0] === item.record._id);
                const positions = record[1][record[1].length - 1];
                item.path = [positions[activeView._id]];
            }
            if (item.type === ActionName.AddField) {
                const fields = sharedType.get('fields')?.toJSON();
                const field = fields?.find((field) => field._id === item.field._id) as AITableViewField;
                item.path = [field.positions[activeView._id]];
            }
            aiTable.apply(item);
        })
    );
}

export function applyYjsEvents(aiTable: AIViewTable, sharedType: SharedType, activeView: AITableView, events: Y.YEvent<any>[]): void {
    if (YjsAITable.isUndo(aiTable)) {
        applyEvents(aiTable, sharedType, activeView, events);
    } else {
        YjsAITable.asRemote(aiTable, () => {
            applyEvents(aiTable, sharedType, activeView, events);
        });
    }
}
