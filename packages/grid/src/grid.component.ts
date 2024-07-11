import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, model, OnInit, output } from '@angular/core';
import { CommonModule, NgClass, NgComponentOutlet, NgForOf } from '@angular/common';
import { SelectOptionPipe } from './pipes/grid';
import { ThyTag } from 'ngx-tethys/tag';
import { ThyPopover, ThyPopoverModule } from 'ngx-tethys/popover';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { buildGridData } from './utils';
import { AITableGridCellRenderSchema, AITableRowHeight } from './types';
import {
    Actions,
    createAITable,
    getDefaultRecord,
    idCreator,
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
        SelectOptionPipe,
        ThyTag,
        ThyPopoverModule,
        ThyIcon,
        FieldPropertyEditorComponent
    ],
    providers: [AITableGridEventService]
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
