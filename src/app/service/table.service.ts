import { computed, Injectable, isDevMode, signal, WritableSignal } from '@angular/core';
import { createSharedType, initSharedType, SharedType } from '../share/shared';
import { WebsocketProvider } from 'y-websocket';
import { getProvider } from '../share/provider';
import { DemoAIField, DemoAIRecord } from '../types';
import { sortDataByPositions } from '../utils/utils';
import { applyYjsEvents } from '../share/apply-to-table';
import { translateSharedTypeToTable } from '../share/utils/translate-to-table';
import { YjsAITable } from '../share/yjs-table';
import { AITable } from '@ai-table/grid';
import { Subject } from 'rxjs';
import { AITableView } from '../types/view';

@Injectable()
export class TableService {
    views!: WritableSignal<AITableView[]>;

    records!: WritableSignal<DemoAIRecord[]>;

    fields!: WritableSignal<DemoAIField[]>;

    aiTable!: AITable;

    provider!: WebsocketProvider | null;

    sharedType!: SharedType | null;

    activeView = computed(() => {
        const activeView = this.views().find((view) => view?.isActive) as AITableView;
        return activeView;
    });

    activeViewChange$ = new Subject<AITableView>();


    initViews(views: AITableView[]) {
        this.views = signal(views);
    }

    updateActiveView(activeViewId: string) {
        this.views.update((value) => {
            const result = value.map((item) => {
                return {
                    ...item,
                    isActive: item.id === activeViewId
                };
            });
            return result;
        });
        this.activeViewChange$.next(this.activeView());
    }

    setAITable(aiTable: AITable) {
        this.aiTable = aiTable;
    }

    initRecordsAndFields(records: DemoAIRecord[], fields: DemoAIField[]) {
        this.records = signal(sortDataByPositions(records, this.activeView().id) as DemoAIRecord[]);
        this.fields = signal(sortDataByPositions(fields, this.activeView().id) as DemoAIField[]);
    }

    setRecords(records?: DemoAIRecord[]) {
        this.records.set(sortDataByPositions(records ?? this.records(), this.activeView().id) as DemoAIRecord[]);
    }

    setFields(fields?: DemoAIField[]) {
        this.fields.set(sortDataByPositions(fields ?? this.fields(), this.activeView().id) as DemoAIField[]);
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
                        const data = translateSharedTypeToTable(this.sharedType!, this.views());
                        this.records.set(data.records);
                        this.fields.set(data.fields);
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
                console.log(123);
                initSharedType(this.sharedType!.doc!, {
                    records: this.records(),
                    fields: this.fields()
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
