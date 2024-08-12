import { computed, Injectable, isDevMode, signal, WritableSignal } from '@angular/core';
import { WebsocketProvider } from 'y-websocket';
import { getDefaultValue, sortDataByView } from '../utils/utils';
import { createDraft, finishDraft } from 'immer';
import { AITableSharedFields, AITableSharedRecords, applyYjsEvents, createSharedType, getProvider, initSharedType, initTable, SharedAITable, SharedType, YjsAITable } from '@ai-table/shared';
import { AITableView } from '../types/view';

@Injectable()
export class TableService {
    views!: WritableSignal<AITableView[]>;

    records!: WritableSignal<AITableSharedRecords>;

    fields!: WritableSignal<AITableSharedFields>;

    aiTable!: SharedAITable;

    provider!: WebsocketProvider | null;

    sharedType!: SharedType | null;

    activeView = computed(() => {
        return this.views().find((view) => view?.isActive) as AITableView;
    });

    initData(views: AITableView[]) {
        this.views = signal(views);
    }

    updateActiveView(activeViewId: string) {
        this.views.update((value) => {
            const draftViews = createDraft(value);
            draftViews.forEach((item) => {
                if (item.isActive && item._id !== activeViewId) {
                    item.isActive = false;
                }
                if (!item.isActive && item._id === activeViewId) {
                    item.isActive = true;
                }
            });
            return finishDraft(draftViews);
        });
    }

    setAITable(aiTable: SharedAITable) {
        this.aiTable = aiTable;
    }

    buildRenderRecords(records?: AITableSharedRecords) {
        this.records = signal(sortDataByView(records ?? this.records(), this.activeView()._id) as AITableSharedRecords);
    }

    buildRenderFields(fields?: AITableSharedFields) {
        this.fields = signal(sortDataByView(fields ?? this.fields(), this.activeView()._id) as AITableSharedFields);
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
                        applyYjsEvents(this.aiTable, events);
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
