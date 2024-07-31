import { CommonModule, NgClass, NgComponentOutlet, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, input, model, NgZone, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ThyAction } from 'ngx-tethys/action';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';
import { ThyDatePickerFormatPipe } from 'ngx-tethys/date-picker';
import { ThyDropdownDirective, ThyDropdownMenuComponent } from 'ngx-tethys/dropdown';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { ThyProgress } from 'ngx-tethys/progress';
import { ThyRate } from 'ngx-tethys/rate';
import { ThyStopPropagationDirective } from 'ngx-tethys/shared';
import { ThyTag } from 'ngx-tethys/tag';
import { ProgressEditorComponent } from './components';
import { FieldMenu } from './components/field-menu/field-menu.component';
import { AITableFieldPropertyEditor } from './components/field-property-editor/field-property-editor.component';
import { DefaultFieldMenus } from './constants';
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
import { SelectOptionPipe } from './pipes/grid';
import { AITableGridEventService } from './services/event.service';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP, AITableGridFieldService } from './services/field.service';
import { AITableGridSelectionService } from './services/selection.servive';
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
        ProgressEditorComponent
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

    takeUntilDestroyed = takeUntilDestroyed();

    aiTable!: AITable;

    get isSelectedAll() {
        return this.aiTable.selection().selectedRecords.size === this.aiRecords().length;
    }

    onChange = output<AITableChangeOptions>();

    aiTableInitialized = output<AITable>();

    fieldMenus!: AITableFieldMenuItem[];

    gridData = computed(() => {
        return buildGridData(this.aiRecords(), this.aiFields(), this.aiTable.selection());
    });

    constructor(
        private elementRef: ElementRef,
        private aiTableGridEventService: AITableGridEventService,
        public aiTableGridSelectionService: AITableGridSelectionService,
        private aiTableGridFieldService: AITableGridFieldService,
        private ngZone: NgZone
    ) {}

    ngOnInit(): void {
        this.initAITable();
        this.initService();
        this.buildFieldMenus();
        this.ngZone.runOutsideAngular(() => {
            this.aiTableGridEventService.mousedownEvent$.pipe(this.takeUntilDestroyed).subscribe((event) => {
                if ((event as MouseEvent)?.target) {
                    this.aiTableGridSelectionService.updateSelect(event as MouseEvent);
                }
            });
        });
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
}
