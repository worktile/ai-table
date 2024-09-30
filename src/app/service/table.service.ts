import {
    AITableView,
    AITableViewFields,
    AITableViewRecords,
    AIViewTable,
    applyYjsEvents,
    initSharedType,
    initTable,
    YjsAITable
} from '@ai-table/state';
import { computed, inject, Injectable, isDevMode, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { getProvider } from '../provider';
import { createFeedRoom, getDefaultValue, sortDataByView } from '../utils/utils';
import { LiveFeedProvider } from '../live-feed/feed-provider';
import { LiveFeedObjectChange, LiveFeedRoom } from '../live-feed/feed-room';
import * as Y from 'yjs';

export const LOCAL_STORAGE_KEY = 'ai-table-active-view-id';

export const TABLE_SERVICE_MAP = new WeakMap<AIViewTable, TableService>();

@Injectable()
export class TableService {
    views!: WritableSignal<AITableView[]>;

    records!: WritableSignal<AITableViewRecords>;

    fields!: WritableSignal<AITableViewFields>;

    aiTable!: AIViewTable;

    provider!: LiveFeedProvider | null;

    feedRoom!: LiveFeedRoom | null;

    tableDoc!: Y.Doc;

    recordDocs!: Y.Doc[];

    activeViewId: WritableSignal<string> = signal('');

    router = inject(Router);

    activeView = computed(() => {
        return this.views().find((view) => view._id === this.activeViewId()) as AITableView;
    });

    initData(views: AITableView[]) {
        this.views = signal(views);
    }

    setActiveView(activeViewId: string) {
        this.activeViewId.set(activeViewId);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}`, activeViewId);
    }

    setAITable(aiTable: AIViewTable) {
        this.aiTable = aiTable;
    }

    buildRenderRecords(records?: AITableViewRecords) {
        this.records = signal(sortDataByView(records ?? this.records(), this.activeViewId()) as AITableViewRecords);
    }

    buildRenderFields(fields?: AITableViewFields) {
        this.fields = signal(sortDataByView(fields ?? this.fields(), this.activeViewId()) as AITableViewFields);
    }

    handleShared(roomId: string) {
        if (this.provider) {
            this.disconnect();
            return;
        }
        let isInitialized = false;
        if (!this.feedRoom) {
            const { feedRoom, tableDoc, recordDocs } = createFeedRoom(roomId);
            this.tableDoc = tableDoc;
            this.feedRoom = feedRoom;
            this.recordDocs = recordDocs;
            this.feedRoom?.on('change', (change: LiveFeedObjectChange) => {
                if (!YjsAITable.isLocal(this.aiTable)) {
                    if (!isInitialized) {
                        const data = initTable(this.getSharedAITable());
                        this.views.set(data.views);
                        this.buildRenderFields(data.fields);
                        this.buildRenderRecords(data.records);
                        isInitialized = true;
                    } else {
                        applyYjsEvents(this.aiTable, this.getSharedAITable(), change.events);
                    }
                }
            });
        }
        this.provider = getProvider(this.feedRoom!, isDevMode());
        this.provider.once('synced', () => {
            console.log('synced');
            if (this.provider!.synced && [...this.feedRoom!.getObject(roomId).store.clients.keys()].length === 0) {
                console.log('init shared type');
                const value = getDefaultValue();
                initSharedType(this.feedRoom!.getObject(roomId), {
                    records: value.records,
                    fields: value.fields,
                    views: this.views()
                });
            }
        });
    }

    getSharedAITable() {
        const feedObject = this.feedRoom!.getObject(this.feedRoom!.roomId);
        const sharedType = feedObject.getMap<any>('ai-table');
        return sharedType;
    }

    hasSharedAITable() {
        const feedObject = this.feedRoom && this.feedRoom!.getObject(this.feedRoom!.roomId);
        return !!feedObject;
    }

    disconnect() {
        if (this.provider) {
            this.provider.disconnect();
            this.provider = null;
            this.feedRoom = null;
        }
    }
}
