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
    signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { mergeWith } from 'rxjs/operators';
import { DBL_CLICK_EDIT_TYPE, DefaultFieldMenus, MOUSEOVER_EDIT_TYPE } from './constants';
import {
    Actions,
    AIPlugin,
    AITable,
    AITableChangeOptions,
    AITableFields,
    AITableFieldType,
    AITableRecords,
    AITableSelectOptionStyle,
    createAITable,
    createDefaultField,
    getDefaultRecord
} from './core';
import { AITableGridEventService } from './services/event.service';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP, AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';
import { AIFieldConfig, AITableFieldMenuItem, AITableReferences } from './types';

@Component({
    selector: 'ai-table-grid-base',
    template: '',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableGridBase implements OnInit {
    aiRecords = model.required<AITableRecords>();

    aiFields = model.required<AITableFields>();

    aiFieldConfig = input<AIFieldConfig>();

    aiReadonly = input<boolean>();

    aiPlugins = input<AIPlugin[]>();

    aiReferences = input<AITableReferences>();

    AITableFieldType = AITableFieldType;

    AITableSelectOptionStyle = AITableSelectOptionStyle;

    aiTable!: AITable;

    isSelectedAll = computed(() => {
        return this.aiTable.selection().selectedRecords.size === this.aiRecords().length;
    });

    onChange = output<AITableChangeOptions>();

    aiTableInitialized = output<AITable>();

    fieldMenus!: AITableFieldMenuItem[];

    mouseoverRef!: ThyPopoverRef<any>;

    protected ngZone = inject(NgZone);
    protected elementRef = inject(ElementRef);
    protected destroyRef = inject(DestroyRef);
    protected aiTableGridFieldService = inject(AITableGridFieldService);
    protected aiTableGridEventService = inject(AITableGridEventService);
    protected aiTableGridSelectionService = inject(AITableGridSelectionService);

    ngOnInit(): void {
        this.initAITable();
        this.initService();
        this.buildFieldMenus();
    }

    initAITable() {
        this.aiTable = createAITable(this.aiRecords, this.aiFields);
        this.aiPlugins()?.forEach((plugin) => {
            this.aiTable = plugin(this.aiTable);
        });
        this.aiTableInitialized.emit(this.aiTable);
        this.aiTable.onChange = () => {
            this.onChange.emit({
                records: this.aiRecords(),
                fields: this.aiFields(),
                actions: this.aiTable.actions
            });
        };
    }

    initService() {
        this.aiTableGridEventService.initialize(this.aiTable, this.aiFieldConfig()?.fieldPropertyEditor);
        this.aiTableGridSelectionService.initialize(this.aiTable);
        this.aiTableGridEventService.registerEvents(this.elementRef.nativeElement);
        this.aiTableGridFieldService.initAIFieldConfig(this.aiFieldConfig());
        AI_TABLE_GRID_FIELD_SERVICE_MAP.set(this.aiTable, this.aiTableGridFieldService);
    }

    buildFieldMenus() {
        this.fieldMenus = this.aiFieldConfig()?.fieldMenus ?? DefaultFieldMenus;
    }

    addRecord() {
        Actions.addRecord(this.aiTable, getDefaultRecord(this.aiFields()), [this.aiRecords().length]);
    }

    selectRecord(recordId: string) {
        this.aiTableGridSelectionService.selectRecord(recordId);
    }

    toggleSelectAll(checked: boolean) {
        this.aiTableGridSelectionService.toggleSelectAll(checked);
    }

    addField(gridColumnBlank?: HTMLElement, position?: { x: number; y: number }) {
        const field = signal(createDefaultField(this.aiTable, AITableFieldType.text));
        this.aiTableGridFieldService.editFieldProperty(this.aiTable, field, false, gridColumnBlank, position);
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

            this.aiTableGridEventService.mouseoverEvent$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
                this.mouseoverHandle(event);
            });
            this.aiTableGridEventService.globalMouseoverEvent$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
                this.closeHoverCellEditor(event);
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

    private mouseoverHandle(event: MouseEvent) {
        if (this.mouseoverRef) {
            this.mouseoverRef?.close();
        }
        const cellDom = (event.target as HTMLElement).closest('.grid-cell') as HTMLElement;
        const type = cellDom && (cellDom.getAttribute('type')! as AITableFieldType);
        if (type && MOUSEOVER_EDIT_TYPE.includes(type)) {
            this.mouseoverRef = this.aiTableGridEventService.openEdit(cellDom);
        }
    }

    private closeHoverCellEditor(e: MouseEvent) {
        if (this.mouseoverRef) {
            const hasGrid = e.target && (e.target as HTMLElement).closest('.ai-table-grid');
            const hasCellEditor = e.target && (e.target as HTMLElement).closest('.grid-cell-editor');
            if (!hasGrid && !hasCellEditor) {
                this.mouseoverRef.close();
            }
        }
    }
}
