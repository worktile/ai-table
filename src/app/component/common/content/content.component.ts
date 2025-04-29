import {
    AddFieldOptions,
    AddRecordOptions,
    AIFieldConfig,
    AITable,
    AITableDomGrid,
    AITableField,
    AITableFieldType,
    AITableGrid,
    AITableActions,
    AITableQueries,
    AITableRecord,
    DateFieldValue,
    MoveFieldOptions,
    NumberPath,
    UpdateFieldValueOptions,
    RichTextFieldValue,
    AI_TABLE_CELL,
    AI_TABLE_CELL_ATTACHMENT_ADD,
    AI_TABLE_CELL_EDIT,
    KoEventObjectOutput,
    SetFieldWidthOptions,
    MoveRecordOptions
} from '@ai-table/grid';
import {
    Actions,
    addFields,
    addRecords,
    AITableView,
    AIViewTable,
    applyActionOps,
    buildRemoveFieldItem,
    CopyCellsItem,
    DividerMenuItem,
    EditFieldPropertyItem,
    CopyFieldPropertyItem,
    PasteCellsItem,
    RemoveRecordsItem,
    updateFieldValue,
    withState,
    YjsAITable,
    moveFields,
    moveRecords,
    addCopyFields
} from '@ai-table/state';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ThyAction } from 'ngx-tethys/action';
import { ThyDatePickerFormatPipe } from 'ngx-tethys/date-picker';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThySegment, ThySegmentEvent, ThySegmentItem } from 'ngx-tethys/segment';
import { withRemoveView } from '../../../plugins/view.plugin';
import { TABLE_SERVICE_MAP, TableService } from '../../../service/table.service';
import { getBigData, getCanvasDefaultValue, getReferences } from '../../../utils/utils';
import { getUnixTime } from 'date-fns';
import { AITableGridI18nKey } from '@ai-table/grid';
import { AITableStateI18nKey } from '@ai-table/state';
import _, { get, isNil } from 'lodash';
import { filter, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
const LOCAL_STORAGE_DATA_MODE = 'ai-table-demo-data-mode';
const LOCAL_STORAGE_RENDER_MODE = 'ai-table-demo-render-mode';
const LOCAL_STORAGE_AI_TABLE_DATA = 'ai-table-demo-data';

@Component({
    selector: 'demo-table-content',
    standalone: true,
    imports: [ThyPopoverModule, ThyAction, FormsModule, ThySegment, ThySegmentItem, AITableGrid, AITableDomGrid],
    templateUrl: './content.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-block w-100 h-100'
    }
})
export class DemoTableContent {
    private datePickerFormatPipe = new ThyDatePickerFormatPipe();

    aiTable!: AIViewTable;

    plugins = [withState, withRemoveView];

    aiFieldConfig: Signal<AIFieldConfig> = computed(() => {
        const readonly = this.tableService.readonly();
        const onlyOneField = this.tableService.fields().length === 1;
        return {
            fieldRenderers: {
                [AITableFieldType.date]: {
                    transform: (field: AITableField, value: DateFieldValue) => {
                        if (isNil(value)) {
                            return value;
                        }
                        return this.datePickerFormatPipe.transform(value.timestamp as any);
                    }
                },
                [AITableFieldType.createdAt]: {
                    transform: (field: AITableField, value: DateFieldValue) => {
                        if (isNil(value)) {
                            return value;
                        }
                        return this.datePickerFormatPipe.transform(value.timestamp as any);
                    }
                },
                [AITableFieldType.updatedAt]: {
                    transform: (field: AITableField, value: DateFieldValue) => {
                        if (isNil(value)) {
                            return value;
                        }
                        return this.datePickerFormatPipe.transform(value.timestamp as any);
                    }
                },
                [AITableFieldType.richText]: {
                    transform: (field: AITableField, value: RichTextFieldValue) => {
                        return value
                            .map((item) => {
                                const texts = _.get(item, 'children', [])
                                    .map((child: { text?: string }) => _.get(child, 'text', ''))
                                    .filter((text: string) => text);
                                return texts.join('');
                            })
                            .filter((text) => text)
                            .join(' ');
                    }
                }
            },
            fieldMenus: (aiTable: AITable) => {
                return [
                    { ...EditFieldPropertyItem(aiTable), hidden: () => readonly } as any,
                    {
                        ...CopyFieldPropertyItem(aiTable, (data: AddFieldOptions) => {
                            this.addCopyField(data);
                        }),
                        hidden: () => readonly
                    } as any,
                    { ...DividerMenuItem, hidden: () => readonly },
                    {
                        type: 'sortByAsc',
                        name: (field: AITableField) => {
                            const fieldType = field.type;
                            switch (fieldType) {
                                case AITableFieldType.progress:
                                case AITableFieldType.rate:
                                case AITableFieldType.number:
                                case AITableFieldType.date:
                                    return '按 1 → 9 排序';
                                case AITableFieldType.select:
                                    return '按选项正序排序';
                                default:
                                    return '按 A → Z 排序';
                            }
                        },
                        icon: 'sort',
                        exec: (aiTable: AITable, field: Signal<AITableField>) => {}
                    },
                    {
                        type: 'sortByDesc',
                        name: (field: AITableField) => {
                            const fieldType = field.type;
                            switch (fieldType) {
                                case AITableFieldType.progress:
                                case AITableFieldType.rate:
                                case AITableFieldType.number:
                                case AITableFieldType.date:
                                    return '按 9 → 1 排序';
                                case AITableFieldType.select:
                                    return '按选项倒序排序';
                                default:
                                    return '按 Z → A 排序';
                            }
                        },
                        icon: 'sort-reverse',
                        exec: (aiTable: AITable, field: Signal<AITableField>) => {}
                    },
                    {
                        type: 'filterFields',
                        name: '按本列筛选',
                        icon: 'filter-line',
                        exec: (aiTable: AITable, field: Signal<AITableField>) => {},
                        hidden: (aiTable: AITable, field: Signal<AITableField>) => false,
                        disabled: (aiTable: AITable, field: Signal<AITableField>) => false
                    },
                    { ...DividerMenuItem, hidden: () => readonly || onlyOneField },
                    {
                        ...buildRemoveFieldItem(aiTable, () => {
                            const member = 'member_03';
                            const time = new Date().getTime();
                            return { updated_at: time, updated_by: member };
                        }),
                        hidden: () => readonly || onlyOneField
                    }
                ];
            }
        };
    });

    canUndoCount = computed(() => {
        return this.tableService.canUndoCount();
    });

    canRedoCount = computed(() => {
        return this.tableService.canRedoCount();
    });

    canUndo = computed(() => {
        return this.canUndoCount() > 0;
    });

    canRedo = computed(() => {
        return this.canRedoCount() > 0;
    });

    actions: AITableActions = {
        updateFieldValue: (data: UpdateFieldValueOptions) => {
            this.updateFieldValue(data);
        },
        setField: (field: AITableField) => {
            this.setField(field);
        },
        addRecord: (data: AddRecordOptions) => {
            this.addRecord(data);
        },
        addField: (data: AddFieldOptions) => {
            this.addField(data);
        }
    };

    contextMenuItems = (aiTable: AITable) => {
        return [
            {
                ...CopyCellsItem(aiTable, this.actions),
                disabled: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => false,
                hidden: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => this.tableService.readonly()
            },
            {
                ...PasteCellsItem(aiTable, this.actions),
                disabled: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => false,
                hidden: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => this.tableService.readonly()
            },
            {
                ...DividerMenuItem,
                disabled: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => false,
                hidden: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => this.tableService.readonly()
            },
            {
                ...RemoveRecordsItem(aiTable, this.actions),
                disabled: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => false,
                hidden: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => this.tableService.readonly()
            }
        ];
    };

    ngOnInit(): void {
        if (this.tableService.sharedType) {
            this.tableService.buildRenderRecords();
            this.tableService.buildRenderFields();
        } else {
            this.dataMode.set(this.getLocalDataMode(LOCAL_STORAGE_DATA_MODE) || 'default');
            this.setValue();
        }
    }

    iconRegistry = inject(ThyIconRegistry);

    sanitizer = inject(DomSanitizer);

    tableService = inject(TableService);

    destroyRef = inject(DestroyRef);

    references = signal(getReferences());

    dataMode = signal<'default' | 'big-data'>('default');

    dateModeActiveIndex = computed(() => (this.dataMode() === 'default' ? 0 : 1));

    getI18nTextByKey = (key: string) => {
        switch (key) {
            case AITableGridI18nKey.dataPickerPlaceholder:
                return 'Select Date';
            case AITableStateI18nKey.copyField:
                return 'Copy Field';
        }
        return;
    };

    constructor() {
        this.registryIcon();
        afterNextRender(() => {
            this.bindUndoShortcuts();
        });
    }

    ngAfterViewInit() {}

    registryIcon() {
        this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/defs/svg/sprite.defs.svg'));
    }

    private bindUndoShortcuts() {
        fromEvent<KeyboardEvent>(document, 'keydown')
            .pipe(
                filter((event) => (event.ctrlKey || event.metaKey) && event.key === 'z'),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(async (event) => {
                if (event.shiftKey) {
                    // 重做操作
                    this.tableService.redo();
                } else {
                    // 撤销操作
                    this.tableService.undo();
                }
            });
    }

    onClick(e: KoEventObjectOutput<MouseEvent>) {
        if ((e.targetNameDetail.targetName = AI_TABLE_CELL)) {
            const field = this.aiTable.fieldsMap()[e.targetNameDetail.fieldId!];
            if (field?.type === AITableFieldType.attachment && e.targetNameDetail.source) {
                if (e.targetNameDetail.source === AI_TABLE_CELL_ATTACHMENT_ADD) {
                    alert('打开附件编辑窗口');
                } else {
                    const file = e.event.target.attrs.attachmentInfo;
                    alert(`打开附件: ${file.title}`);
                }
            }

            if (field?.type === AITableFieldType.richText && e.targetNameDetail.source) {
                if (e.targetNameDetail.source === AI_TABLE_CELL_EDIT) {
                    alert('打开多行文本编辑');
                }
            }
        }
    }

    setValue() {
        const value = this.dataMode() === 'default' ? getCanvasDefaultValue() : getBigData();
        this.tableService.buildRenderRecords(value.records);
        this.tableService.buildRenderFields(value.fields);
    }

    changeDataMode(e: ThySegmentEvent<any>) {
        this.dataMode.set(e.value);
        this.setLocalStorage(LOCAL_STORAGE_DATA_MODE, e.value);
        this.setValue();
    }

    addRecord(data: AddRecordOptions) {
        const member = 'member_01';
        const time = getUnixTime(new Date());
        addRecords(this.aiTable, data, { created_by: member, created_at: time, updated_by: member, updated_at: time });
    }

    updateFieldValue(value: UpdateFieldValueOptions) {
        const member = 'member_02';
        const time = new Date().getTime();
        updateFieldValue(this.aiTable, value, { updated_by: member, updated_at: time });
    }

    setField(field: AITableField) {
        Actions.setField(this.aiTable, field, [field._id]);
    }

    addField(data: AddFieldOptions) {
        const member = 'member_02';
        const time = new Date().getTime();
        addFields(this.aiTable, data, { updated_by: member, updated_at: time });
    }

    addCopyField(data: AddFieldOptions) {
        const member = 'member_02';
        const time = new Date().getTime();
        addCopyFields(this.aiTable, data, { updated_by: member, updated_at: time });
    }

    dragMoveField(data: MoveFieldOptions) {
        const member = 'member_02';
        const time = new Date().getTime();
        moveFields(this.aiTable, data, { updated_by: member, updated_at: time });
    }

    setFieldWidth(data: SetFieldWidthOptions) {
        Actions.setFieldWidth(this.aiTable, data.path, data.width);
    }

    dragMoveRecords(data: MoveRecordOptions) {
        const member = 'member_02';
        const time = new Date().getTime();
        moveRecords(this.aiTable, data, { updated_by: member, updated_at: time });
    }

    prevent(event: Event) {
        event.stopPropagation();
        event.preventDefault();
    }

    aiTableInitialized(aiTable: AITable) {
        this.aiTable = aiTable as AIViewTable;
        this.aiTable.views = this.tableService.views;
        this.aiTable.activeViewId = this.tableService.activeViewId;
        this.aiTable.viewsMap = computed(() => {
            return this.tableService.views().reduce(
                (object, item) => {
                    object[item._id] = item;
                    return object;
                },
                {} as { [key: string]: AITableView }
            );
        });
        this.aiTable.onChange = () => {
            this.setLocalStorage(
                LOCAL_STORAGE_AI_TABLE_DATA,
                JSON.stringify({
                    records: this.aiTable.records(),
                    fields: this.aiTable.fields(),
                    views: this.aiTable.views(),
                    actions: this.aiTable.actions
                })
            );
            if (this.tableService.sharedType) {
                if (!YjsAITable.isRemote(this.aiTable) && !YjsAITable.isUndo(this.aiTable)) {
                    YjsAITable.asLocal(this.aiTable, () => {
                        applyActionOps(this.aiTable, this.tableService.sharedType!, this.aiTable.actions);
                    });
                }
            }
        };
        TABLE_SERVICE_MAP.set(this.aiTable, this.tableService);
        this.tableService.setAITable(this.aiTable);
    }

    removeRecord() {
        const recordIds = [...this.aiTable.selection().selectedRecords.keys()];
        recordIds.forEach((id) => {
            Actions.removeRecord(this.aiTable, [id]);
        });
    }

    getLocalRenderMode(key: string) {
        const value = localStorage.getItem(key) as 'dom' | 'canvas';
        return value ? value : null;
    }

    getLocalDataMode(key: string) {
        const value = localStorage.getItem(key) as 'default' | 'big-data';
        return value ? value : null;
    }

    setLocalStorage(key: string, mode: string) {
        localStorage.setItem(key, mode);
    }

    undo() {
        this.tableService.undo();
    }

    redo() {
        this.tableService.redo();
    }
}
