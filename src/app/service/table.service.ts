import {
    AIViewTable,
    applyYjsEvents,
    buildFieldsByView,
    buildRecordsByView,
    createSharedType,
    getSharedTypeByData,
    getDataBySharedType,
    YjsAITable,
    UndoManagerService,
    sortViews,
    buildLinearRows,
    buildRecordsWithWillMoveRecords
} from '@ai-table/state';
import { computed, inject, Injectable, isDevMode, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketProvider } from 'y-websocket';
import { getProvider } from '../provider';
import { getBasicData } from '../utils/utils';
import {
    AITableFieldType,
    AITableRecordHeightType,
    AITableValue,
    AITableView,
    AITableViewFields,
    AITableViewRecords,
    SharedType
} from '@ai-table/utils';
import { scrollToMatchedCell, AITableLinearRow } from '@ai-table/grid';
import { Actions } from '@ai-table/state';

export const LOCAL_STORAGE_KEY = 'ai-table-active-view-id';
const LOCAL_STORAGE_AI_TABLE_SHARED_DATA = 'ai-table-demo-shared-data';

export const TABLE_SERVICE_MAP = new WeakMap<AIViewTable, TableService>();

@Injectable()
export class TableService {
    views!: WritableSignal<AITableView[]>;
    private undoManagerService = inject(UndoManagerService);

    get canUndoCount() {
        return this.undoManagerService.canUndoCount;
    }

    get canRedoCount() {
        return this.undoManagerService.canRedoCount;
    }

    readonly: WritableSignal<boolean> = signal(false);

    hiddenIndexColumn: WritableSignal<boolean> = signal(false);

    hiddenRowDrag: WritableSignal<boolean> = signal(false);

    hiddenExpandRecord: WritableSignal<boolean> = signal(false);

    maxRecords: WritableSignal<number> = signal(500);

    maxFields: WritableSignal<number> = signal(500);

    // rowHeight: WritableSignal<AITableRowHeight> = signal(AITableRowHeight.low);

    records!: WritableSignal<AITableViewRecords>;

    fields!: WritableSignal<AITableViewFields>;

    aiTable!: AIViewTable;

    provider!: WebsocketProvider | null;

    sharedType!: SharedType | null;

    activeViewId: WritableSignal<string> = signal('');

    router = inject(Router);

    rowHeight = computed(() => {
        // return this.views().find((view) => view._id === this.activeViewId()) as AITableView;
        const activeView = this.activeView();
        return activeView?.settings?.record_height_type ?? AITableRecordHeightType.low;
    });

    activeView = computed(() => {
        return this.views().find((view) => view._id === this.activeViewId()) as AITableView;
    });

    activeViewShortId = computed(() => {
        return this.activeView().short_id;
    });

    sortKeysMap: Partial<Record<AITableFieldType, string>> = {
        [AITableFieldType.createdBy]: 'display_name_pinyin',
        [AITableFieldType.updatedBy]: 'display_name_pinyin',
        [AITableFieldType.member]: 'display_name_pinyin'
    };

    renderRecords = computed(() => {
        return buildRecordsByView(this.aiTable, this.records(), this.fields(), this.activeView() as AITableView) as AITableViewRecords;
    });

    renderFields = computed(() => {
        const result = buildFieldsByView(this.aiTable, this.fields(), this.activeView()) as AITableViewFields;
        return result;
    });

    sortedViews = computed(() => {
        return sortViews(this.views());
    });

    keywords = signal('');

    aiBuildRenderDataFn: Signal<() => AITableValue> = computed(() => {
        return () => {
            return {
                records: this.renderRecords(),
                fields: this.renderFields()
            };
        };
    });

    aiBuildGroupLinearRowsFn: Signal<() => AITableLinearRow[] | null> = computed(() => {
        return () => {
            const activeView = this.activeView();
            if (activeView?.settings?.groups?.length) {
                const records = this.renderRecords();

                return buildLinearRows(this.aiTable, activeView, buildRecordsWithWillMoveRecords(records, this.aiTable.recordsWillMove()));
            }
            return null;
        };
    });

    initData(views: AITableView[]) {
        this.views = signal(views);
    }

    setReadonly(readonly: boolean) {
        this.readonly.set(readonly);
    }

    setHiddenIndexColumn(hiddenIndexColumn: boolean) {
        this.hiddenIndexColumn.set(hiddenIndexColumn);
    }

    setHiddenRowDrag(hiddenRowDrag: boolean) {
        this.hiddenRowDrag.set(hiddenRowDrag);
    }

    setHiddenExpandRecord(hiddenExpandRecord: boolean) {
        this.hiddenExpandRecord.set(hiddenExpandRecord);
    }

    setMaxRecords(maxRecords: number) {
        this.maxRecords.set(maxRecords);
    }

    setMaxFields(maxFields: number) {
        this.maxFields.set(maxFields);
    }

    setRowHeight(rowHeight: AITableRecordHeightType) {
        Actions.setRecordHeightType(this.aiTable, rowHeight);
    }

    setActiveView(activeViewId: string) {
        this.activeViewId.set(activeViewId);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}`, activeViewId);
    }

    setAITable(aiTable: AIViewTable) {
        this.aiTable = aiTable;
    }

    setRecords(records?: AITableViewRecords) {
        this.records = signal(records ?? this.records());
    }

    setFields(fields?: AITableViewFields) {
        this.fields = signal(fields ?? this.fields());
    }

    handleShared(room: string) {
        if (this.provider) {
            this.disconnect();
            return;
        }

        let isInitialized = false;
        if (!this.sharedType) {
            this.sharedType = createSharedType();
            this.initializeUndoManager();
            this.sharedType.observeDeep((events: any) => {
                if (!YjsAITable.isLocal(this.aiTable)) {
                    if (!isInitialized) {
                        const data = getDataBySharedType(this.sharedType!);
                        this.views.set(data.views);
                        this.setRecords(data.records);
                        this.setFields(data.fields);
                        isInitialized = true;
                    } else {
                        applyYjsEvents(this.aiTable, this.sharedType!, events);
                    }
                }
                localStorage.setItem(LOCAL_STORAGE_AI_TABLE_SHARED_DATA, JSON.stringify(this.sharedType!.toJSON()));
            });
        }
        this.provider = getProvider(this.sharedType.doc!, room, isDevMode());
        this.provider.connect();
        this.provider.once('sync', () => {
            if (this.provider!.synced && [...this.sharedType!.doc!.store.clients.keys()].length === 0) {
                console.log('init shared type');
                const value = getBasicData();
                getSharedTypeByData(this.sharedType!.doc!, {
                    records: value.records,
                    fields: value.fields,
                    views: this.views()
                });
            }
        });
    }

    initializeUndoManager() {
        if (!this.sharedType || !this.aiTable) {
            return;
        }
        this.undoManagerService.initialize(this.sharedType, this.aiTable);
    }

    disconnect() {
        if (this.provider) {
            this.provider.disconnect();
            this.provider = null;
            this.sharedType = null;
            this.undoManagerService.destroy();
        }
    }

    undo() {
        this.undoManagerService.undo();
    }

    redo() {
        this.undoManagerService.redo();
    }

    setSearchKeywords(keywords: string) {
        this.keywords.set(keywords);
        scrollToMatchedCell(this.aiTable, 0);
    }
}
