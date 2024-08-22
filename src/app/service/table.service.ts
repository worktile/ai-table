import { computed, Injectable, isDevMode, signal, WritableSignal } from '@angular/core';
import { WebsocketProvider } from 'y-websocket';
import { getDefaultValue, sortByView } from '../utils/utils';
import {
    AIViewTable,
    SharedType,
    YjsAITable,
    applyYjsEvents,
    createSharedType,
    initSharedType,
    initTable,
    AITableView
} from '@ai-table/state';
import { getProvider } from '../provider';
import { AITableFields, AITableRecords } from '@ai-table/grid';

export const LOCAL_STORAGE_KEY = 'ai-table-active-view-id';

export const TABLE_SERVICE_MAP = new WeakMap<AIViewTable, TableService>();

@Injectable()
export class TableService {
    views!: WritableSignal<AITableView[]>;

    records!: WritableSignal<AITableRecords>;

    fields!: WritableSignal<AITableFields>;

    aiTable!: AIViewTable;

    provider!: WebsocketProvider | null;

    sharedType!: SharedType | null;

    activeViewId: WritableSignal<string> = signal('');

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

    buildRenderRecords(records?: AITableRecords) {
        this.records = signal(sortByView(records ?? this.records(), this.activeView(), 'record') as AITableRecords);
    }

    buildRenderFields(fields?: AITableFields) {
        this.fields = signal(sortByView(fields ?? this.fields(), this.activeView(), 'field') as AITableFields);
    }

    handleShared(room: string) {
        if (this.provider) {
            this.disconnect();
            return;
        }

        let isInitialized = false;
        if (!this.sharedType) {
            this.sharedType = createSharedType();
            this.sharedType.observeDeep((events: any) => {
                if (!YjsAITable.isLocal(this.aiTable)) {
                    if (!isInitialized) {
                        const data = initTable(this.sharedType!);
                        this.buildRenderFields(data.fields);
                        this.buildRenderRecords(data.records);
                        this.views.set(data.views);
                        isInitialized = true;
                    } else {
                        applyYjsEvents(this.aiTable, this.activeViewId(), this.sharedType!, events);
                    }
                }
            });
        }
        this.provider = getProvider(this.sharedType.doc!, room, isDevMode());
        this.provider.connect();
        this.provider.once('synced', () => {
            if (this.provider!.synced && [...this.sharedType!.doc!.store.clients.keys()].length === 0) {
                console.log('init shared type');
                const value = getDefaultValue();
                initSharedType(this.sharedType!.doc!, {
                    records: value.records,
                    fields: value.fields,
                    views: this.views()
                });
            }
        });
    }

    disconnect() {
        if (this.provider) {
            this.provider.disconnect();
            this.provider = null;
            this.sharedType = null;
        }
    }
}
