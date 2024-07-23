import { ChangeDetectionStrategy, Component, computed, ElementRef, input, model, OnInit, output, signal } from '@angular/core';
import { CommonModule, NgClass, NgComponentOutlet, NgForOf } from '@angular/common';
import { SelectOptionPipe } from './pipes/grid';
import { ThyTag } from 'ngx-tethys/tag';
import { ThyPopoverModule } from 'ngx-tethys/popover';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { buildGridData } from './utils';
import { AICustomAction, AIFieldConfig, AITableFieldMenu, AITableRowHeight } from './types';
import {
    Actions,
    createAITable,
    getDefaultRecord,
    AITable,
    AITableChangeOptions,
    AITableFields,
    AITableFieldType,
    AITableRecords,
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
import { ThyStopPropagationDirective } from 'ngx-tethys/shared';
import { FieldMenu } from './components/field-menu/field-menu.component';
import { ThyAction } from 'ngx-tethys/action';
import { ThyDropdownDirective, ThyDropdownMenuComponent } from 'ngx-tethys/dropdown';
import { DefaultFieldMenus } from './constants';
import { AI_TABLE_GRID_FIELD_SERVICE_MAP, AITableGridFieldService } from './services/field.service';

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
        ThyDropdownMenuComponent
    ],
    providers: [ThyTooltipService, AITableGridEventService, AITableGridFieldService]
})
export class AITableGrid implements OnInit {
    aiRecords = model.required<AITableRecords>();

    aiFields = model.required<AITableFields>();

    aiRowHeight = input<AITableRowHeight>();

    aiFieldConfig = input<AIFieldConfig>();

    aiReadonly = input<boolean>();

    aiCustomAction = input<AICustomAction>();

    AITableFieldType = AITableFieldType;

    takeUntilDestroyed = takeUntilDestroyed();

    aiTable!: AITable;

    onChange = output<AITableChangeOptions>();

    aiTableInitialized = output<AITable>();

    fieldMenus!: AITableFieldMenu[];

    gridData = computed(() => {
        return buildGridData(this.aiRecords(), this.aiFields());
    });

    constructor(
        private elementRef: ElementRef,
        private aiTableGridEventService: AITableGridEventService,
        private aiTableGridFieldService: AITableGridFieldService
    ) {}

    ngOnInit(): void {
        this.initAITable();
        this.initService();
        this.buildFieldMenus();
    }

    initAITable() {
        this.aiTable = createAITable(this.aiRecords, this.aiFields, this.aiCustomAction ? this.aiCustomAction() : {});
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

    addField(gridColumnBlank: HTMLElement) {
        const field = signal(createDefaultField(this.aiTable, AITableFieldType.Text));
        this.aiTableGridFieldService.editFieldProperty(gridColumnBlank, this.aiTable, field, false);
    }
}
