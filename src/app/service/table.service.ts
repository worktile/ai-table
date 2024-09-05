import { computed, inject, Injectable, isDevMode, signal, WritableSignal } from '@angular/core';
import { createFeedRoom, getDefaultValue, sortDataByView } from '../utils/utils';
import {
    AITableViewRecords,
    AITableViewFields,
    AIViewTable,
    YjsAITable,
    applyYjsEvents,
    initSharedType,
    initTable,
    AITableView
} from '@ai-table/state';
import { getProvider } from '../provider';
import { Router } from '@angular/router';
import { LiveFeedObjectChange, LiveFeedRoom } from '../live-feed/feed-room';
import { LiveFeedProvider } from '../live-feed/feed-provider';

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
            this.feedRoom = createFeedRoom(roomId);
            this.feedRoom?.on('change', (changes: LiveFeedObjectChange[]) => {
                changes.forEach((change: LiveFeedObjectChange) => {
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
