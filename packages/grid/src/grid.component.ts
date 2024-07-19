import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, input, model, OnInit, output } from '@angular/core';
import { CommonModule, NgClass, NgComponentOutlet, NgForOf } from '@angular/common';
import { SelectedOneFieldPipe, SelectOptionPipe } from './pipes/grid';
import { ThyTag } from 'ngx-tethys/tag';
import { ThyPopover, ThyPopoverModule } from 'ngx-tethys/popover';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { buildGridData } from './utils';
import { AITableGridCellRenderSchema, AITableRowHeight, AITableSelection } from './types';
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
    AITableRecord
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
    providers: [ThyTooltipService, AITableGridEventService, AITableGridSelectionService]
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

    get selection() {
        return this.aiTableGridSelectionService.selection();
    }

    onChange = output<AITableChangeOptions>();

    gridData = computed(() => {
        return buildGridData(this.aiRecords(), this.aiFields());
    });

    constructor(
        private elementRef: ElementRef,
        private aiTableGridEventService: AITableGridEventService,
        private thyPopover: ThyPopover,
        public aiTableGridSelectionService: AITableGridSelectionService
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
