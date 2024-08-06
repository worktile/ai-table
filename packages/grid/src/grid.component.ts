import { CommonModule, NgClass, NgComponentOutlet, NgForOf } from '@angular/common';
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
import { FormsModule } from '@angular/forms';
import { ThyAction } from 'ngx-tethys/action';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';
import { ThyDatePickerFormatPipe } from 'ngx-tethys/date-picker';
import { ThyDropdownDirective, ThyDropdownMenuComponent } from 'ngx-tethys/dropdown';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyPopoverModule, ThyPopoverRef } from 'ngx-tethys/popover';
import { ThyProgress } from 'ngx-tethys/progress';
import { ThyRate } from 'ngx-tethys/rate';
import { ThyStopPropagationDirective } from 'ngx-tethys/shared';
import { ThyTag } from 'ngx-tethys/tag';
import { mergeWith } from 'rxjs/operators';
import { ProgressEditorComponent, RateDisplayComponent } from './components';
import { FieldMenu } from './components/field-menu/field-menu.component';
import { AITableFieldPropertyEditor } from './components/field-property-editor/field-property-editor.component';
import { DBL_CLICK_EDIT_TYPE, DefaultFieldMenus, MOUSEOVER_EDIT_TYPE } from './constants';
import {
    Actions,
    AIPlugin,
    AITable,
    AITableChangeOptions,
    AITableFields,
    AITableFieldType,
    AITableRecords,
    createAITable,
    createDefaultField,
    getDefaultRecord
} from './core';
import { SelectOptionPipe } from './pipes/grid.pipe';
import { AITableGridEventService } from './services/event.service';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP, AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.service';
import { AIFieldConfig, AITableFieldMenuItem, AITableRowHeight } from './types';
import { buildGridData } from './utils';

@Component({
    selector: 'ai-table-grid',
    templateUrl: './grid.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid'
    },
    imports: [
        NgForOf,
        NgClass,
        NgComponentOutlet,
        CommonModule,
        FormsModule,
        SelectOptionPipe,
        ThyTag,
        ThyPopoverModule,
        ThyIcon,
        ThyRate,
        ThyProgress,
        AITableFieldPropertyEditor,
        ThyDatePickerFormatPipe,
        ThyFlexibleText,
        ThyStopPropagationDirective,
        FieldMenu,
        ThyAction,
        ThyDropdownDirective,
        ThyDropdownMenuComponent,
        ThyCheckboxModule,
        ProgressEditorComponent,
        RateDisplayComponent
    ],
    providers: [AITableGridEventService, AITableGridFieldService, AITableGridSelectionService]
})
export class AITableGrid implements OnInit {
    aiRecords = model.required<AITableRecords>();

    aiFields = model.required<AITableFields>();

    aiRowHeight = input<AITableRowHeight>();

    aiFieldConfig = input<AIFieldConfig>();

    aiReadonly = input<boolean>();

    aiPlugins = input<AIPlugin[]>();

    AITableFieldType = AITableFieldType;

    aiTable!: AITable;

    get isSelectedAll() {
        return this.aiTable.selection().selectedRecords.size === this.aiRecords().length;
    }

    onChange = output<AITableChangeOptions>();

    aiTableInitialized = output<AITable>();

    fieldMenus!: AITableFieldMenuItem[];

    mouseoverRef!: ThyPopoverRef<any>;

    gridData = computed(() => {
        return buildGridData(this.aiRecords(), this.aiFields(), this.aiTable.selection());
    });

    private ngZone = inject(NgZone);
    private elementRef = inject(ElementRef);
    private destroyRef = inject(DestroyRef);
    private aiTableGridFieldService = inject(AITableGridFieldService);
    private aiTableGridEventService = inject(AITableGridEventService);
    public aiTableGridSelectionService = inject(AITableGridSelectionService);

    ngOnInit(): void {
        this.initAITable();
        this.initService();
        this.buildFieldMenus();
        this.subscribeEvents();
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

    addField(gridColumnBlank: HTMLElement) {
        const field = signal(createDefaultField(this.aiTable, AITableFieldType.text));
        this.aiTableGridFieldService.editFieldProperty(gridColumnBlank, this.aiTable, field, false);
    }

    private subscribeEvents() {
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
        const readonly = cellDom && cellDom.getAttribute('readonly')!;
        if (type && !readonly && DBL_CLICK_EDIT_TYPE.includes(type)) {
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
