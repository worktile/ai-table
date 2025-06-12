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
    signal,
    Signal,
    WritableSignal
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
    SetFieldWidthOptions,
    UpdateFieldValueOptions
} from '@ai-table/utils';
import { AITableGridEventService } from './services/event.service';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP, AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';
import { AIFieldConfig, AITableFieldMenuItem, AITableContextMenuItem } from './types';
import { AITableFieldSetting } from './components';
import { KoEventObjectOutput } from './angular-konva';
import { AITableGridI18nKey } from './utils/i18n';
import { AIPlugin, AITable, createAITable, createDefaultField } from './core';

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

    aiReferences = input.required<AITableReferences>();

    aiBuildRenderDataFn = input<(aiTable: AITable) => AITableValue>();

    aiGetI18nTextByKey = input<(key: AITableGridI18nKey | string) => string | undefined>();

    aiKeywords = input<string>();

    AITableFieldType = AITableFieldType;

    AITableSelectOptionStyle = AITableSelectOptionStyle;

    aiTable!: AITable;

    isSelectedAll = computed(() => {
        return this.aiTable.selection().selectedRecords.size === this.aiRecords().length;
    });

    aiTableInitialized = output<AITable>();

    aiAddRecord = output<AddRecordOptions>();

    aiAddField = output<AddFieldOptions>();

    aiMoveField = output<MoveFieldOptions>();

    aiUpdateFieldValue = output<UpdateFieldValueOptions>();

    aiSetField = output<AITableField>();

    aiSetFieldWidth = output<SetFieldWidthOptions>();

    aiMoveRecords = output<MoveRecordOptions>();

    aiClick = output<KoEventObjectOutput<MouseEvent>>();

    aiDbClick = output<KoEventObjectOutput<MouseEvent>>();

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
            return this.aiBuildRenderDataFn()!(this.aiTable);
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
    protected aiTableGridSelectionService = inject(AITableGridSelectionService);

    ngOnInit(): void {
        this.initAITable();
        this.initService();
    }

    initAITable() {
        this.aiTable = createAITable(this.aiRecords, this.aiFields, this.gridData);
        if (this.aiGetI18nTextByKey()) {
            this.aiTable.getI18nTextByKey = this.aiGetI18nTextByKey() as (key: AITableGridI18nKey | string) => string;
        }
        this.aiPlugins()?.forEach((plugin) => {
            this.aiTable = plugin(this.aiTable);
        });
        this.aiTableInitialized.emit(this.aiTable);
    }

    initService() {
        this.aiTableGridEventService.initialize(this.aiTable, this.aiFieldConfig()?.fieldRenderers);
        this.aiTableGridSelectionService.initialize(this.aiTable);
        this.aiTableGridEventService.registerEvents(this.elementRef.nativeElement);
        this.aiTableGridFieldService.initAIFieldConfig(this.aiFieldConfig());
        AI_TABLE_GRID_FIELD_SERVICE_MAP.set(this.aiTable, this.aiTableGridFieldService);
    }

    addRecord(options?: AddRecordOptions) {
        const records = this.aiTable.gridData().records;
        const recordCount = records.length;
        if (this.aiMaxRecords() && recordCount >= this.aiMaxRecords()!) {
            return;
        }
        this.aiAddRecord.emit(options || {});
    }

    selectRecord(recordId: string) {
        this.aiTableGridSelectionService.selectRecord(recordId);
    }

    toggleSelectAll(checked: boolean) {
        this.aiTableGridSelectionService.toggleSelectAll(checked);
    }

    addField(gridColumnBlank?: HTMLElement, position?: { x: number; y: number }) {
        if (this.aiMaxFields() && this.aiTable.gridData().fields.length >= this.aiMaxFields()!) {
            return;
        }
        const field = createDefaultField(this.aiTable, AITableFieldType.text);
        const popoverRef = this.aiTableGridFieldService.editFieldProperty(this.aiTable, {
            field,
            isUpdate: false,
            origin: gridColumnBlank!,
            position
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
            this.aiTableGridEventService.mousedownEvent$
                .pipe(mergeWith(this.aiTableGridEventService.globalMousedownEvent$), takeUntilDestroyed(this.destroyRef))
                .subscribe((event) => {
                    this.aiTableGridSelectionService.updateSelect(event);
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
