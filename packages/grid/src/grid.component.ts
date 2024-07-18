import { ChangeDetectionStrategy, Component, computed, ElementRef, input, model, OnInit, output } from '@angular/core';
import { CommonModule, NgClass, NgComponentOutlet, NgForOf } from '@angular/common';
import { SelectedOneFieldPipe, SelectOptionPipe } from './pipes/grid';
import { ThyTag } from 'ngx-tethys/tag';
import { ThyPopover, ThyPopoverModule } from 'ngx-tethys/popover';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { buildGridData } from './utils';
import { AITableGridCellRenderSchema, AITableRowHeight } from './types';
import {
    Actions,
    createAITable,
    getDefaultRecord,
    AITable,
    AITableChangeOptions,
    AITableFields,
    AITableFieldType,
    AITableRecords,
    AITableField
} from './core';
import { ThyIcon } from 'ngx-tethys/icon';
import { AITableGridEventService } from './services/event.service';
import { FieldPropertyEditorComponent } from './components/field-property-editor/field-property-editor.component';
import { ThyDatePickerFormatPipe } from 'ngx-tethys/date-picker';
import { ThyRate } from 'ngx-tethys/rate';
import { FormsModule } from '@angular/forms';
import { ThyFlexibleText } from 'ngx-tethys/flexible-text';
import { ThyTooltipModule, ThyTooltipService } from 'ngx-tethys/tooltip';
import { ThyStopPropagationDirective } from 'ngx-tethys/shared';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';

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
        SelectedOneFieldPipe,
        ThyTag,
        ThyPopoverModule,
        ThyIcon,
        ThyRate,
        FieldPropertyEditorComponent,
        ThyDatePickerFormatPipe,
        ThyTooltipModule,
        ThyFlexibleText,
        ThyCheckboxModule,
        ThyStopPropagationDirective
    ],
    providers: [ThyTooltipService, AITableGridEventService]
})
export class AITableGridComponent implements OnInit {
    aiRecords = model.required<AITableRecords>();

    aiFields = model.required<AITableFields>();

    aiRowHeight = input<AITableRowHeight>();

    aiFieldRenderers = input<Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>>();

    aiReadonly = input<boolean>();

    AITableFieldType = AITableFieldType;

    takeUntilDestroyed = takeUntilDestroyed();

    aiTable!: AITable;

    isSelectedAll = false;

    selection = new Map<string, {}>();

    selectedHeader = new Set();

    onChange = output<AITableChangeOptions>();

    gridData = computed(() => {
        return buildGridData(this.aiRecords(), this.aiFields());
    });

    constructor(
        private elementRef: ElementRef,
        private aiTableGridEventService: AITableGridEventService,
        private thyPopover: ThyPopover
    ) {}

    ngOnInit(): void {
        this.initAITable();
        this.aiTableGridEventService.initialize(this.aiTable, this.aiFieldRenderers());
        this.aiTableGridEventService.registerEvents(this.elementRef.nativeElement);
    }

    initAITable() {
        this.aiTable = createAITable(this.aiRecords, this.aiFields);
        this.aiTable.onChange = () => {
            this.onChange.emit({
                records: this.aiRecords(),
                fields: this.aiFields(),
                actions: this.aiTable.actions
            });
        };
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

    clearSelection() {
        this.selection.clear();
        this.selectedHeader.clear();
    }

    selectCell(recordId: string, fieldId: string) {
        this.clearSelection();
        this.toggleAllCheckbox(false);
        this.selection.set(recordId, { [fieldId]: '' });
    }

    selectCol(field: any) {
        this.clearSelection();
        this.toggleAllCheckbox(false);
        // 选择表头
        this.selectedHeader.add(field.name);
        this.aiRecords().forEach((item) => {
            const value = item.value[field.id];
            this.selection.set(item.id, { [field.id]: value });
        });
    }

    selectRow() {
        this.clearSelection();
        this.gridData().records.forEach((record) => {
            if (record.checked) {
                this.selection.set(record.id, record.value);
            }
        });
    }

    toggleSelectAll() {
        this.clearSelection();
        if (this.isSelectedAll) {
            this.toggleAllCheckbox(true);
            this.aiRecords().forEach((item) => {
                this.selection.set(item.id, item.value);
            });
        } else {
            this.toggleAllCheckbox(false);
        }
    }

    addField(event: Event) {
        this.thyPopover.open(FieldPropertyEditorComponent, {
            origin: event.currentTarget as HTMLElement,
            manualClosure: true,
            placement: 'bottomLeft',
            initialState: {
                fields: this.aiFields,
                confirmAction: (field: AITableField) => {
                    Actions.addField(this.aiTable, field, [this.aiFields().length]);
                }
            }
        });
    }
}
