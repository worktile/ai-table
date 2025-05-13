import {
    AIViewTable,
    applyYjsEvents,
    buildFieldsByView,
    buildRecordsByView,
    createSharedType,
    getSharedTypeByData,
    getDataBySharedType,
    YjsAITable,
    getFieldsSizeMap,
    UndoManagerService,
    sortViews
} from '@ai-table/state';
import { computed, inject, Injectable, isDevMode, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketProvider } from 'y-websocket';
import { getProvider } from '../provider';
import { getCanvasDefaultValue, sortDataByView } from '../utils/utils';
import {
    AITableFieldsSizeMap,
    AITableFieldType,
    AITableValue,
    AITableView,
    AITableViewFields,
    AITableViewRecords,
    SharedType
} from '@ai-table/utils';

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

    rowDragDisabled: WritableSignal<boolean> = signal(false);

    hiddenIndexColumn: WritableSignal<boolean> = signal(false);

    maxRecords: WritableSignal<number> = signal(500);

    maxFields: WritableSignal<number> = signal(500);

    maxPasteCellsCount: WritableSignal<number> = signal(100);

    records!: WritableSignal<AITableViewRecords>;

    fields!: WritableSignal<AITableViewFields>;

    fieldsSizeMap!: WritableSignal<AITableFieldsSizeMap>;

    aiTable!: AIViewTable;

    provider!: WebsocketProvider | null;

    sharedType!: SharedType | null;

    activeViewId: WritableSignal<string> = signal('');

    router = inject(Router);

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
        return buildRecordsByView(
            this.aiTable,
            this.records(),
            this.fields(),
            this.activeView() as AITableView,
            this.sortKeysMap
        ) as AITableViewRecords;
    });

    renderFields = computed(() => {
        const result = buildFieldsByView(this.aiTable, this.fields(), this.activeView()) as AITableViewFields;
        return result;
    });

    renderFieldsSizeMap = computed(() => {
        return getFieldsSizeMap(this.renderFields(), this.activeView());
    });

    sortedViews = computed(() => {
        return sortViews(this.views());
    });

    keywords = computed(() => {
        return this.activeView().settings?.keywords;
    });

    aiBuildRenderDataFn: Signal<() => AITableValue> = computed(() => {
        return () => {
            return {
                records: this.renderRecords(),
                fields: this.renderFields(),
                fieldsSizeMap: this.renderFieldsSizeMap()
            };
        };
    });

    initData(views: AITableView[]) {
        this.views = signal(views);
    }

    setReadonly(readonly: boolean) {
        this.readonly.set(readonly);
    }

    setRowDragDisabled(rowDragDisabled: boolean) {
        this.rowDragDisabled.set(rowDragDisabled);
    }

    setHiddenIndexColumn(hiddenIndexColumn: boolean) {
        this.hiddenIndexColumn.set(hiddenIndexColumn);
    }

    setMaxRecords(maxRecords: number) {
        this.maxRecords.set(maxRecords);
    }

    setMaxFields(maxFields: number) {
        this.maxFields.set(maxFields);
    }

    setMaxPasteCellsCount(maxPasteCellsCount: number) {
        this.maxPasteCellsCount.set(maxPasteCellsCount);
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

    buildRenderFieldsSizeMap(fields?: AITableViewFields) {
        this.fieldsSizeMap = signal(getFieldsSizeMap(fields ?? this.fields(), this.activeView()));
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
                        this.buildRenderFields(data.fields);
                        this.buildRenderRecords(data.records);
                        this.buildRenderFieldsSizeMap(this.fields());
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
                const value = getCanvasDefaultValue();
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
}
