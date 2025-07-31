import {
    AIFieldConfig,
    AITable,
    AITableGrid,
    AITableActions,
    AI_TABLE_CELL,
    AI_TABLE_CELL_ATTACHMENT_ADD,
    AI_TABLE_CELL_EDIT,
    KoEventObjectOutput,
    AI_TABLE_FIELD_MAX_WIDTH,
    expandCell,
    AITableGridI18nText
} from '@ai-table/grid';
import {
    Actions,
    addFields,
    addRecords,
    AIViewTable,
    applyActionOps,
    buildRemoveFieldItem,
    freezeToThisColumn,
    restoreDefaultFrozenColumn,
    calculateAdaptiveFrozenColumnCount,
    CopyCellsItem,
    DividerMenuItem,
    EditFieldPropertyItem,
    CopyFieldPropertyItem,
    PasteCellsItem,
    RemoveRecordsItem,
    updateFieldValues,
    withState,
    YjsAITable,
    moveFields,
    moveRecords,
    InsertUpwardRecords,
    InsertDownwardRecords,
    AITableStateI18nText
} from '@ai-table/state';
import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal, Signal } from '@angular/core';
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
import _ from 'lodash';
import { filter, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    AddFieldOptions,
    AddRecordOptions,
    AITableField,
    AITableFieldType,
    AITableView,
    DateFieldValue,
    MoveFieldOptions,
    MoveRecordOptions,
    RichTextFieldValue,
    SetFieldWidthOptions,
    UpdateFieldValueOptions,
    isUndefinedOrNull,
    AITableFieldGroup,
    FieldValue,
    AITableUtilsI18nText,
    AITableViewField,
    SetFieldStatTypeOptions
} from '@ai-table/utils';
import { ThyInputNumber } from 'ngx-tethys/input-number';
import { CommonModule } from '@angular/common';
import { ThyStopPropagationDirective } from 'ngx-tethys/shared';
import { renderRelationCell } from '../../../custom-field/relation/render';
import { AITableCellRelationTicket } from '../../../custom-field/relation/hover-render';
import { AITableCustomReferences } from '../../../types/grid';
import { AITableCustomFieldType } from '../../../types/field';
import { RelationTicketField } from '../../../custom-field/relation/field-model';
import { RelationIconPath } from '../../../icons/icon-path';
import { AI_TABLE_CELL_MORE_COUNT, AI_TABLE_CELL_TICKET_ADD } from '../../../constants/field';

const LOCAL_STORAGE_DATA_MODE = 'ai-table-demo-data-mode';
const LOCAL_STORAGE_AI_TABLE_DATA = 'ai-table-demo-data';

const AITableI18nText: Record<string, string> = {
    ...AITableUtilsI18nText,
    ...AITableGridI18nText,
    ...AITableStateI18nText,
    [AITableGridI18nKey.dataPickerPlaceholder]: 'Select Date',
    [AITableStateI18nKey.copyField]: 'Copy Field',
    [AITableGridI18nKey.fieldGroupBase]: 'Basic',
    [AITableGridI18nKey.fieldTypeNumber]: 'Number'
};

@Component({
    selector: 'ai-table-add-input',
    template: ` <thy-input-number [(ngModel)]="modelValue().value" thyStopPropagation></thy-input-number> `,
    imports: [ThyInputNumber, CommonModule, FormsModule, ThyStopPropagationDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuAddRecordsComponent {
    modelValue = input.required<{ value: number }>();
}

@Component({
    selector: 'demo-table-content',
    imports: [ThyPopoverModule, ThyAction, FormsModule, ThySegment, ThySegmentItem, AITableGrid],
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

    aiFieldConfig: Signal<AIFieldConfig<AITableCustomReferences>> = computed(() => {
        const readonly = this.tableService.readonly();
        const onlyOneField = this.tableService.fields().length === 1;
        return {
            hiddenIndexColumn: this.tableService.hiddenIndexColumn(),
            hiddenRowDrag: this.tableService.hiddenRowDrag(),
            customFields: {
                [AITableCustomFieldType.customDemo]: {
                    fieldOption: {
                        type: AITableCustomFieldType.customDemo,
                        group: AITableFieldGroup.advanced,
                        name: '自定义字段',
                        icon: 'ticket',
                        path: RelationIconPath,
                        width: AI_TABLE_FIELD_MAX_WIDTH,
                        minWidth: 245
                    },
                    fieldModel: new RelationTicketField(),
                    render: renderRelationCell,
                    coverRender: AITableCellRelationTicket,
                    getDefaultFieldValue: (field: AITableField) => {
                        return null;
                    }
                }
            },
            fieldRenderers: {
                [AITableFieldType.date]: {
                    toText: (field: AITableField, value: DateFieldValue) => {
                        if (isUndefinedOrNull(value)) {
                            return value;
                        }
                        return this.datePickerFormatPipe.transform(value.timestamp as any);
                    }
                },
                [AITableFieldType.createdAt]: {
                    toText: (field: AITableField, value: DateFieldValue) => {
                        if (isUndefinedOrNull(value)) {
                            return value;
                        }
                        return this.datePickerFormatPipe.transform(value.timestamp as any);
                    }
                },
                [AITableFieldType.updatedAt]: {
                    toText: (field: AITableField, value: DateFieldValue) => {
                        if (isUndefinedOrNull(value)) {
                            return value;
                        }
                        return this.datePickerFormatPipe.transform(value.timestamp as any);
                    }
                },
                [AITableFieldType.richText]: {
                    toText: (field: AITableField, value: RichTextFieldValue) => {
                        if (Array.isArray(value)) {
                            return (value || [])
                                .map((item) => {
                                    const texts = _.get(item, 'children', [])
                                        .map((child: { text?: string }) => _.get(child, 'text', ''))
                                        .filter((text: string) => text);
                                    return texts.join('');
                                })
                                .filter((text) => text)
                                .join(' ');
                        }
                        return value;
                    },
                    toFieldValue: (text: string, cellValue: FieldValue) => {
                        if (typeof text !== 'string') {
                            return text;
                        }
                        return text.split('\n').map((i) => {
                            return {
                                type: 'paragraph',
                                children: [
                                    {
                                        text: i
                                    }
                                ]
                            };
                        });
                    }
                }
            },
            fieldMenus: (aiTable: AITable) => {
                return [
                    { ...EditFieldPropertyItem(aiTable, this.actions, this.references()), hidden: () => readonly } as any,
                    {
                        ...CopyFieldPropertyItem(aiTable, (data: AddFieldOptions) => {
                            this.addField(data);
                        }),
                        hidden: () => readonly
                    } as any,
                    { ...DividerMenuItem, hidden: () => readonly },
                    freezeToThisColumn(this.aiTable),
                    restoreDefaultFrozenColumn(this.aiTable),
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

    calculateFrozenCount = (containerWidth: number) => {
        return calculateAdaptiveFrozenColumnCount(this.aiTable, containerWidth, 200);
    };

    actions: AITableActions = {
        updateFieldValues: (data: UpdateFieldValueOptions[]) => {
            this.updateFieldValues(data);
        },
        setField: (field: AITableField) => {
            this.setField(field);
        },
        setFieldStatType: (data: SetFieldStatTypeOptions) => {
            this.setFieldStatType(data);
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
                ...InsertUpwardRecords(aiTable, this.actions),
                disabled: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => false,
                hidden: (aiTable: AITable, targetName: string, position: { x: number; y: number }) => this.tableService.readonly()
            },
            {
                ...InsertDownwardRecords(aiTable, this.actions),
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
        return AITableI18nText[key];
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
        if (e.targetNameDetail.targetName === AI_TABLE_CELL) {
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

            if (field?.type === AITableCustomFieldType.customDemo && e.targetNameDetail.source) {
                if (e.targetNameDetail.source === AI_TABLE_CELL_TICKET_ADD) {
                    alert('打开新增工单窗口');
                } else if (e.targetNameDetail.source === AI_TABLE_CELL_MORE_COUNT) {
                    expandCell(this.aiTable, [e.targetNameDetail.recordId!, e.targetNameDetail.fieldId!]);
                } else {
                    alert('打开工单详情');
                }
            }
        }
    }

    onDbClick(e: KoEventObjectOutput<MouseEvent>) {
        if (e.targetNameDetail.targetName === AI_TABLE_CELL) {
            const field = this.aiTable.fieldsMap()[e.targetNameDetail.fieldId!];
            if (field?.type === AITableCustomFieldType.customDemo) {
                expandCell(this.aiTable, [e.targetNameDetail.recordId!, e.targetNameDetail.fieldId!]);
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

    addRecord(options?: AddRecordOptions) {
        const member = 'member_01';
        const time = getUnixTime(new Date());
        const trackableEntity = { created_by: member, created_at: time, updated_by: member, updated_at: time };
        addRecords(this.aiTable, trackableEntity, options);
    }

    updateFieldValues(options: UpdateFieldValueOptions[]) {
        const member = 'member_02';
        const time = new Date().getTime();
        updateFieldValues(this.aiTable, options, { updated_by: member, updated_at: time });
    }

    setField(field: AITableField) {
        Actions.setField(this.aiTable, field, [field._id]);
    }

    addField(data: AddFieldOptions) {
        addFields(this.aiTable, data);
    }

    dragMoveField(data: MoveFieldOptions) {
        moveFields(this.aiTable, data);
    }

    setFieldWidth(data: SetFieldWidthOptions) {
        Actions.setFieldWidth(this.aiTable, data.path, data.width);
    }

    setFieldStatType(data: SetFieldStatTypeOptions) {
        Actions.setFieldStatType(this.aiTable, data.path, data.statType);
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
