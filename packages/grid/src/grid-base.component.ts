import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    input,
    model,
    NgZone,
    OnInit,
    output,
    Signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { mergeWith } from 'rxjs';
import { DBL_CLICK_EDIT_TYPE } from './constants';
import {
    AddFieldOptions,
    AddRecordOptions,
    AITableField,
    AITableFields,
    AITableFieldsSizeMap,
    AITableFieldType,
    AITableRecords,
    AITableReferences,
    AITableSelectOptionStyle,
    AITableValue,
    MoveFieldOptions,
    MoveRecordOptions,
    SetFieldStatTypeOptions,
    SetFieldWidthOptions,
    UpdateFieldValueOptions
} from '@ai-table/utils';
import { AITableGridEventService } from './services/event.service';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP, AITableGridFieldService } from './services/field.service';
import { AIFieldConfig, AITableFieldMenuItem, AITableContextMenuItem, AITableLinearRow } from './types';
import { AITableFieldSetting } from './components';
import { KoEventObjectOutput } from './angular-konva';
import { AITableGridI18nKey } from './utils/i18n';
import { AIPlugin, AITable, createAITable, createDefaultField } from './core';
import { toggleSelectRecord, toggleSelectAllRecords } from './utils';

@Component({
    selector: 'ai-table-grid-base',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableGridBase implements OnInit {
    aiRecords = model.required<AITableRecords>();

    aiFields = model.required<AITableFields>();

    aiFieldsSizeMap = model.required<AITableFieldsSizeMap>();

    aiContextMenuItems = input<(aiTable: AITable) => AITableContextMenuItem[]>();

    aiFieldConfig = input<AIFieldConfig>();

    aiReadonly = input<boolean>(false);

    aiPlugins = input<AIPlugin[]>();

    aiMaxFields = input<number | undefined>();

    aiMaxRecords = input<number | undefined>();

    aiMaxSelectOptions = input<number | undefined>();

    aiReferences = input.required<AITableReferences>();

    aiBuildRenderDataFn = input<(aiTable: AITable) => AITableValue>();

    aiBuildGroupLinearRowsFn = input<(aiTable: AITable) => AITableLinearRow[] | null>();

    aiSortKeysMap = input<Partial<Record<AITableFieldType, string>>>();

    aiGetI18nTextByKey = input<(key: AITableGridI18nKey | string) => string | undefined>();

    aiKeywords = input<string>();

    aiFrozenColumnCountFn = input<(containerWidth: number) => number>();

    AITableFieldType = AITableFieldType;

    AITableSelectOptionStyle = AITableSelectOptionStyle;

    aiTable!: AITable;

    // TODO 列表为空时，不应该显示全选
    isSelectedAll = computed(() => {
        return this.aiTable.selection().selectedRecords.size === this.aiRecords().length;
    });

    aiTableInitialized = output<AITable>();

    aiAddRecord = output<AddRecordOptions>();

    aiAddField = output<AddFieldOptions>();

    aiMoveField = output<MoveFieldOptions>();

    aiUpdateFieldValues = output<UpdateFieldValueOptions[]>();

    aiSetField = output<AITableField>();

    aiSetFieldWidth = output<SetFieldWidthOptions>();

    aiSetFieldStatType = output<SetFieldStatTypeOptions>();

    aiMoveRecords = output<MoveRecordOptions>();

    aiClick = output<KoEventObjectOutput<MouseEvent>>();

    aiDbClick = output<KoEventObjectOutput<MouseEvent>>();

    aiRowGroupCollapseClick = output<string>();

    fieldMenus: Signal<AITableFieldMenuItem[]> = computed(() => {
        const fieldMenusFn = this.aiFieldConfig()?.fieldMenus;
        if (fieldMenusFn && this.aiTable) {
            return fieldMenusFn(this.aiTable);
        }
        return [];
    });

    mouseoverRef!: ThyPopoverRef<any>;

    gridData = computed(() => {
        this.aiTable.recordsWillHidden();
        if (this.aiBuildRenderDataFn && this.aiBuildRenderDataFn() && this.aiTable) {
            const gridData = this.aiBuildRenderDataFn()!(this.aiTable);

            console.log('gridData computed：', gridData);
            return gridData;
        }

        return {
            records: this.aiRecords(),
            fields: this.aiFields(),
            fieldsSizeMap: this.aiFieldsSizeMap()
        };
    });

    protected ngZone = inject(NgZone);
    protected elementRef = inject(ElementRef);
    protected destroyRef = inject(DestroyRef);
    protected aiTableGridFieldService = inject(AITableGridFieldService);
    protected aiTableGridEventService = inject(AITableGridEventService);

    ngOnInit(): void {
        console.log('aiRecords', this.aiRecords());
        console.log('aiFields', this.aiFields());
        console.log('aiFieldsSizeMap', this.aiFieldsSizeMap());
        console.log('aiKeywords', this.aiKeywords());
        console.log('aiReferences', this.aiReferences());
        console.log('aiFieldSizeMap', this.aiFieldsSizeMap());
        console.log('aiSortKeysMap', this.aiSortKeysMap());
        console.log('aiGetI18nTextByKey', this.aiGetI18nTextByKey());
        console.log('aiPlugins', this.aiPlugins());
        console.log('aiFieldConfig', this.aiFieldConfig());
        console.log('aiMaxFields', this.aiMaxFields());
        console.log('aiMaxRecords', this.aiMaxRecords());
        console.log('aiMaxSelectOptions', this.aiMaxSelectOptions());

        this.initAITable();
        this.initService();
    }

    initAITable() {
        this.aiTable = createAITable(this.aiRecords, this.aiFields, this.gridData);
        if (this.aiGetI18nTextByKey()) {
            this.aiTable.getI18nTextByKey = this.aiGetI18nTextByKey() as (key: AITableGridI18nKey | string) => string;
        }
        if (this.aiSortKeysMap()) {
            this.aiTable.sortKeysMap = this.aiSortKeysMap();
        }
        this.aiPlugins()?.forEach((plugin) => {
            this.aiTable = plugin(this.aiTable);
        });
        this.aiTableInitialized.emit(this.aiTable);
        console.log('aiTable initialized', this.aiTable);
        console.log('--------------------------------');
    }

    initService() {
        this.aiTableGridEventService.initialize(this.aiTable, this.aiFieldConfig()?.fieldRenderers);
        this.aiTableGridEventService.registerEvents(this.elementRef.nativeElement);
        this.aiTableGridFieldService.initAIFieldConfig(this.aiFieldConfig());
        AI_TABLE_GRID_FIELD_SERVICE_MAP.set(this.aiTable, this.aiTableGridFieldService);
    }

    addRecord(options?: AddRecordOptions) {
        const records = this.aiTable.records();
        const recordCount = records.length;
        if (this.aiMaxRecords() && recordCount >= this.aiMaxRecords()!) {
            return;
        }
        this.aiAddRecord.emit(options || {});
    }

    toggleSelectRecord(recordId: string) {
        toggleSelectRecord(this.aiTable, recordId);
    }

    toggleSelectAll(checked: boolean) {
        toggleSelectAllRecords(this.aiTable, checked);
    }

    addField(gridColumnBlank?: HTMLElement, position?: { x: number; y: number }) {
        if (this.aiMaxFields() && this.aiTable.fields().length >= this.aiMaxFields()!) {
            return;
        }
        const field = createDefaultField(this.aiTable, AITableFieldType.text);
        const popoverRef = this.aiTableGridFieldService.editFieldProperty(this.aiTable, {
            field,
            isUpdate: false,
            origin: gridColumnBlank!,
            position,
            references: this.aiReferences()
        });
        if (popoverRef && !this.aiFieldConfig()?.fieldSettingComponent) {
            (popoverRef.componentInstance as AITableFieldSetting).addField.subscribe((defaultValue) => {
                const fields = this.gridData().fields;
                const fieldCount = fields.length;
                this.aiAddField.emit({
                    originId: fieldCount > 0 ? fields[fields.length - 1]._id : '',
                    defaultValue
                });
            });
        }
    }

    public subscribeEvents() {
        this.ngZone.runOutsideAngular(() => {
            this.aiTableGridEventService.dblClickEvent$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
                this.dblClick(event);
            });
        });
    }

    private dblClick(event: MouseEvent) {
        const cellDom = (event.target as HTMLElement).closest('.grid-cell') as HTMLElement;
        const type = cellDom && (cellDom.getAttribute('type')! as AITableFieldType);
        if (type && DBL_CLICK_EDIT_TYPE.includes(type)) {
            this.aiTableGridEventService.openEdit(cellDom);
        }
    }
}
