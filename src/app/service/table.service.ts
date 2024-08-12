import { computed, Injectable, isDevMode, signal, WritableSignal } from '@angular/core';
import { createSharedType, initSharedType, SharedType } from '../share/shared';
import { getProvider } from '../share/provider';
import { DemoAIField, DemoAIRecord } from '../types';
import { getDefaultValue, sortDataByView } from '../utils/utils';
import { applySubDocEvents, applyYjsEvents } from '../share/apply-to-table';
import { translateRecord, translateSharedTypeToTable } from '../share/utils/translate-to-table';
import { YjsAITable } from '../share/yjs-table';
import { AITable } from '@ai-table/grid';
import { AITableView } from '../types/view';
import { createDraft, finishDraft } from 'immer';
import { WebsocketProvider } from '../share/y-websocket';
import { Transaction } from 'yjs';
import { LiveBlockProvider } from '../share/live-block-provider';

@Injectable()
export class TableService {
    views!: WritableSignal<AITableView[]>;

    records!: WritableSignal<DemoAIRecord[]>;

    fields!: WritableSignal<DemoAIField[]>;

    aiTable!: AITable;

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

    setAITable(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    buildRenderRecords(records?: DemoAIRecord[]) {
        this.records = signal(sortDataByView(records ?? this.records(), this.activeView()._id) as DemoAIRecord[]);
    }

    buildRenderFields(fields?: DemoAIField[]) {
        this.fields = signal(sortDataByView(fields ?? this.fields(), this.activeView()._id) as DemoAIField[]);
    }

    handleShared(room: string) {
        if (this.provider) {
            this.disconnect();
            return;
        }

        let isInitialized = false;
        if (!this.sharedType) {
            this.sharedType = createSharedType(room);
            this.sharedType.observeDeep((events: any, transaction: Transaction) => {
                if (transaction.origin !== this.provider.doc) {
                    if (!YjsAITable.isLocal(this.aiTable)) {
                        if (!isInitialized) {
                            const data = translateSharedTypeToTable(this.sharedType!);
                            this.buildRenderRecords([]);
                            this.buildRenderFields(data.fields);
                            this.views.set(data.views);
                            isInitialized = true;
                        } else {
                            applyYjsEvents(this.aiTable, events);
                        }
                    }
                }
            });
            this.sharedType.doc.on('subdocs', (subdocs) => {
                console.log('subdocs', subdocs);
                for (const doc of subdocs.added) {
                    if (!this.provider.liveBlocks.get(doc.guid)) {
                        const liveBlock = new LiveBlockProvider(doc.guid, this.provider.ws, doc);
                        this.provider.liveBlocks.set(doc.guid, liveBlock);
                        liveBlock.sync();
                        liveBlock.on('synced', () => {
                            const recordOfYArray = liveBlock.doc.getArray();
                            const formatRecord = recordOfYArray.toJSON();
                            const [nonEditableArray, editableArray] = formatRecord;
                            if (!nonEditableArray || !editableArray) {
                                return;
                            }
                            const record = {
                                _id: nonEditableArray[0],
                                positions: editableArray[editableArray.length - 1],
                                values: translateRecord(editableArray.slice(0, editableArray.length - 1), this.fields())
                            };
                            if (this.records().findIndex((_record) => _record._id === record._id) === -1) {
                                const newRecords = [...this.records(), record];
                                this.buildRenderRecords(newRecords);
                                console.log('synced', record);
                            }
                        });
                        liveBlock.sharedType.observeDeep((events: any) => {
                            if (liveBlock.synced) {
                                console.log(events, 'subdoc changed');
                                if (!YjsAITable.isLocal(this.aiTable)) {
                                    applySubDocEvents(liveBlock, this.aiTable, events);
                                }
                            }
                        });
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
                initSharedType(
                    this.sharedType!.doc!,
                    {
                        records: value.records,
                        fields: value.fields,
                        views: this.views()
                    },
                    this.provider
                );
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
