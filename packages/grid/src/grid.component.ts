import { ChangeDetectionStrategy, Component, computed, ElementRef, input, model, OnInit, output, Signal, signal } from '@angular/core';
import { CommonModule, NgClass, NgComponentOutlet, NgForOf } from '@angular/common';
import { SelectOptionPipe } from './pipes/grid';
import { ThyTag } from 'ngx-tethys/tag';
import { GRID_CELL_EDITOR_MAP } from './constants/editor';
import { ThyPopover, ThyPopoverModule } from 'ngx-tethys/popover';
import { getRecordOrField } from './utils/cell';
import { DBL_CLICK_EDIT_TYPE } from './constants';
import { fromEvent } from 'rxjs';
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
    AITableField,
    AITableFields,
    AITableFieldType,
    AITableRecord,
    AITableRecords
} from './core';
import { FieldConfigComponent } from './components/field-config/field-config.component';
import { ThyIcon } from 'ngx-tethys/icon';

@Component({
    selector: 'ai-table-grid',
    templateUrl: './grid.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ai-table-grid'
    },
    imports: [NgForOf, NgClass, NgComponentOutlet, CommonModule, SelectOptionPipe, ThyTag, ThyPopoverModule, ThyIcon, FieldConfigComponent]
})
export class AITableGridComponent implements OnInit {
    aiRecords = model.required<AITableRecords>();

    aiFields = model.required<AITableFields>();

    aiRowHeight = input<AITableRowHeight>();

    aiFiledRenderers = input<Partial<Record<AITableFieldType, AITableGridCellRenderSchema>>>();

    aiReadonly = input<boolean>();

    AITableFieldType = AITableFieldType;

    takeUntilDestroyed = takeUntilDestroyed();

    aiTable!: AITable;

    onChange = output<AITableChangeOptions>();

    gridData = computed(() => {
        return buildGridData(this.aiRecords(), this.aiFields());
    });

    constructor(
        private thyPopover: ThyPopover,
        private elementRef: ElementRef<HTMLElement>
    ) {}

    ngOnInit(): void {
        this.initializeEventListener();
        this.initAITable();
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
        this.thyPopover.open(FieldConfigComponent, {
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

    getEditorComponent(type: AITableFieldType) {
        const filedRenderers = this.aiFiledRenderers();
        if (filedRenderers && filedRenderers[type]) {
            return filedRenderers[type]!.edit;
        }
        return GRID_CELL_EDITOR_MAP[type];
    }

    initializeEventListener() {
        fromEvent<MouseEvent>(this.elementRef.nativeElement, 'dblclick')
            .pipe(this.takeUntilDestroyed)
            .subscribe((event) => {
                this.dblClick(event as MouseEvent);
            });
    }

    dblClick(event: MouseEvent): void {
        const cellDom = (event.target as HTMLElement).closest('.grid-cell') as HTMLElement;
        const type = cellDom && cellDom.getAttribute('type')!;
        if (type && DBL_CLICK_EDIT_TYPE.includes(Number(type))) {
            this.openEdit(cellDom);
        }
    }

    openEdit(cellDom: HTMLElement) {
        const { x, y, width, height } = cellDom.getBoundingClientRect();
        const fieldId = cellDom.getAttribute('fieldId')!;
        const recordId = cellDom.getAttribute('recordId')!;
        const field = getRecordOrField(this.aiFields, fieldId) as Signal<AITableField>;
        const record = getRecordOrField(this.aiRecords, recordId) as Signal<AITableRecord>;
        const component = this.getEditorComponent(field().type);
        this.thyPopover.open(component, {
            origin: cellDom,
            originPosition: {
                x: x - 1,
                y: y + 1,
                width: width + 2,
                height: height + 2
            },
            width: width + 2 + 'px',
            height: height + 2 + 'px',
            placement: 'top',
            offset: -(height + 4),
            initialState: {
                field: field,
                record: record,
                aiTable: signal(this.aiTable)
            },
            panelClass: 'grid-cell-editor',
            outsideClosable: false,
            hasBackdrop: false,
            manualClosure: true,
            animationDisabled: true
        });
    }
}
