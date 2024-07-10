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
import { VTableGridCellRenderSchema, VTableRowHeight } from './types';
import {
    Actions,
    createVTable,
    getDefaultRecord,
    idCreator,
    VTable,
    VTableChangeOptions,
    VTableField,
    VTableFields,
    VTableFieldType,
    VTableRecord,
    VTableRecords
} from './core';

@Component({
    selector: 'v-table-grid',
    templateUrl: './grid.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'v-table-grid'
    },
    imports: [NgForOf, NgClass, NgComponentOutlet, CommonModule, SelectOptionPipe, ThyTag, ThyPopoverModule]
})
export class VTableGridComponent implements OnInit {
    vtRecords = model.required<VTableRecords>();

    vtFields = model.required<VTableFields>();

    vtRowHeight = input<VTableRowHeight>();

    vtFiledRenderers = input<Partial<Record<VTableFieldType, VTableGridCellRenderSchema>>>();

    vtReadonly = input<boolean>();

    VTableFieldType = VTableFieldType;

    takeUntilDestroyed = takeUntilDestroyed();

    vTable!: VTable;

    onChange = output<VTableChangeOptions>();

    gridData = computed(() => {
        return buildGridData(this.vtRecords(), this.vtFields());
    });

    constructor(
        private thyPopover: ThyPopover,
        private elementRef: ElementRef<HTMLElement>
    ) {}

    ngOnInit(): void {
        this.initializeEventListener();
        this.initVTable();
    }

    initVTable() {
        this.vTable = createVTable(this.vtRecords, this.vtFields);
        this.vTable.onChange = () => {
            this.onChange.emit({
                records: this.vtRecords(),
                fields: this.vtFields(),
                actions: this.vTable.actions
            });
        };
    }

    addRecord() {
        Actions.addRecord(this.vTable, getDefaultRecord(this.vtFields()), [this.vtRecords().length]);
    }

    addField() {
        Actions.addField(
            this.vTable,
            {
                id: idCreator(),
                name: '新增文本',
                type: VTableFieldType.Text
            },
            [this.vtFields().length]
        );
    }

    getEditorComponent(type: VTableFieldType) {
        const filedRenderers = this.vtFiledRenderers();
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
        const field = getRecordOrField(this.vtFields, fieldId) as Signal<VTableField>;
        const record = getRecordOrField(this.vtRecords, recordId) as Signal<VTableRecord>;
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
                vTable: signal(this.vTable)
            },
            panelClass: 'grid-cell-editor',
            outsideClosable: false,
            hasBackdrop: false,
            manualClosure: true,
            animationDisabled: true
        });
    }
}
