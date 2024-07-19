import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    input,
    model,
    OnInit,
    output,
    signal,
    viewChild
} from '@angular/core';
import { CommonModule, NgClass, NgComponentOutlet, NgForOf } from '@angular/common';
import { SelectedOneFieldPipe, SelectOptionPipe } from './pipes/grid';
import { ThyTag } from 'ngx-tethys/tag';
import { ThyPopover, ThyPopoverModule } from 'ngx-tethys/popover';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { buildGridData } from './utils';
import { AIFieldConfig, AITableFieldMenu, AITableRowHeight } from './types';
import {
    Actions,
    createAITable,
    getDefaultRecord,
    AITable,
    AITableChangeOptions,
    AITableFields,
    AITableFieldType,
    AITableRecords,
    AITableField,
    AITableRecord,
    createDefaultField
} from './core';
import { ThyIcon } from 'ngx-tethys/icon';
import { AITableGridEventService } from './services/event.service';
import { AITableFieldPropertyEditor } from './components/field-property-editor/field-property-editor.component';
import { ThyDatePickerFormatPipe } from 'ngx-tethys/date-picker';
import { ThyRate } from 'ngx-tethys/rate';
import { FormsModule } from '@angular/forms';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyTooltipModule, ThyTooltipService } from 'ngx-tethys/tooltip';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';
import { ThyStopPropagationDirective } from 'ngx-tethys/shared';
import { FieldMenu } from './components/field-menu/field-menu.component';
import { ThyAction } from 'ngx-tethys/action';
import { ThyDropdownDirective, ThyDropdownMenuComponent } from 'ngx-tethys/dropdown';
import { DefaultFieldMenus } from './constants';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP, AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.servive';

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
        AITableFieldPropertyEditor,
        ThyDatePickerFormatPipe,
        ThyTooltipModule,
        ThyFlexibleText,
        ThyStopPropagationDirective,
        FieldMenu,
        ThyAction,
        ThyDropdownDirective,
        ThyDropdownMenuComponent,
        ThyCheckboxModule
    ],
    providers: [ThyTooltipService, AITableGridEventService, AITableGridFieldService, AITableGridSelectionService]
})
export class AITableGrid implements OnInit {
    aiRecords = model.required<AITableRecords>();

    aiFields = model.required<AITableFields>();

    aiRowHeight = input<AITableRowHeight>();

    aiFieldConfig = input<AIFieldConfig>();

    aiReadonly = input<boolean>();

    AITableFieldType = AITableFieldType;

    takeUntilDestroyed = takeUntilDestroyed();

    aiTable!: AITable;

    isSelectedAll = false;

    get selection() {
        return this.aiTableGridSelectionService.selection();
    }

    onChange = output<AITableChangeOptions>();

    aiTableInitialized = output<AITable>();

    fieldMenus!: AITableFieldMenu[];

    gridData = computed(() => {
        return buildGridData(this.aiRecords(), this.aiFields());
    });

    constructor(
        private elementRef: ElementRef,
        private aiTableGridEventService: AITableGridEventService,
        private thyPopover: ThyPopover,
        public aiTableGridSelectionService: AITableGridSelectionService,
        private aiTableGridFieldService: AITableGridFieldService
    ) {
        effect(
            () => {
                this.aiTable.selection.set(this.aiTableGridSelectionService.selection());
                console.log('跟新啦', this.aiTable.selection());
            },
            { allowSignalWrites: true }
        );
    }

    ngOnInit(): void {
        this.initAITable();
        this.initService();
        this.buildFieldMenus();
    }

    initAITable() {
        this.aiTable = createAITable(this.aiRecords, this.aiFields);
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

    toggleAllCheckbox(checked: boolean) {
        const data = this.gridData().records.map((item) => {
            return { ...item, checked: checked };
        });
        this.gridData().records = data;
    }

    selectCell(recordId: string, fieldId: string) {
        this.toggleAllCheckbox(false);
        this.isSelectedAll = false;
        this.aiTableGridSelectionService.selectCell(recordId, fieldId);
    }

    selectCol(field: any) {
        this.toggleAllCheckbox(false);
        this.isSelectedAll = false;
        this.aiTableGridSelectionService.selectCol(field.id);
    }

    selectRow(record: AITableRecord) {
        this.aiTableGridSelectionService.selectRow(record.id);
        this.isSelectedAll = this.selection.selectedRecords.size === this.aiRecords().length;
    }

    toggleSelectAll() {
        this.aiTableGridSelectionService.clearSelection();
        if (this.isSelectedAll) {
            this.toggleAllCheckbox(true);
            this.aiRecords().forEach((item) => {
                this.selectRow(item);
            });
        } else {
            this.toggleAllCheckbox(false);
        }
    }

    addField(gridColumnBlank: HTMLElement) {
        const field = signal(createDefaultField(this.aiTable, AITableFieldType.Text));
        this.aiTableGridFieldService.editFieldProperty(gridColumnBlank, this.aiTable, field, false);
    }
}
