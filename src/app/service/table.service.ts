import { computed, inject, Injectable, isDevMode, signal, WritableSignal } from '@angular/core';
import { WebsocketProvider } from 'y-websocket';
import { getDefaultValue, sortDataByView } from '../utils/utils';
import {
    AITableViewRecords,
    AITableViewFields,
    AIViewTable,
    SharedType,
    YjsAITable,
    applyYjsEvents,
    createSharedType,
    initSharedType,
    initTable,
    AITableView,
    AITableViews
} from '@ai-table/state';
import { getProvider } from '../provider';
import { Router } from '@angular/router';

export const LOCAL_STORAGE_KEY = 'ai-table-active-view-id';

export const TABLE_SERVICE_MAP = new WeakMap<AIViewTable, TableService>();

@Injectable()
export class TableService {
    views!: WritableSignal<AITableView[]>;

    records!: WritableSignal<AITableViewRecords>;

    fields!: WritableSignal<AITableViewFields>;

    aiTable!: AIViewTable;

    provider!: WebsocketProvider | null;

    sharedType!: SharedType | null;

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
                        this.views.set(data.views);
                        let activeView = localStorage.getItem(`${LOCAL_STORAGE_KEY}`);
                        if (!activeView || (activeView && (data.views as AITableViews).findIndex((item) => item._id === activeView) < 0)) {
                            activeView = data.views[0]._id;
                        }
                        this.setActiveView(activeView!);
                        this.router.navigate([`/${activeView!}`]);
                        this.buildRenderFields(data.fields);
                        this.buildRenderRecords(data.records);
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
