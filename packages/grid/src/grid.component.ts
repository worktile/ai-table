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
    Signal,
    signal
} from '@angular/core';
import { CommonModule, NgClass, NgComponentOutlet, NgForOf } from '@angular/common';
import { GridConfig } from './types';
import { SelectOptionPipe } from './pipes/grid';
import { ThyTag } from 'ngx-tethys/tag';
import { GRID_CELL_EDITOR_MAP } from './constants/editor';
import { THY_POPOVER_SCROLL_STRATEGY, ThyPopover } from 'ngx-tethys/popover';
import { Overlay } from '@angular/cdk/overlay';
import { thyPopoverScrollStrategyFactory } from './utils/global';
import { getCellInfo } from './utils/cell';
import { DomSanitizer } from '@angular/platform-browser';
import { ThyIconRegistry } from 'ngx-tethys/icon';
import { DBL_CLICK_EDIT_TYPE } from './constants';
import { VTableFieldType, VTableViewType, VTableValue, createVTable, VTable, VTableAction, Actions, getDefaultRecord } from '@v-table/core';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { buildGridData } from './utils';

@Component({
    selector: 'v-table-grid',
    templateUrl: './grid.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'v-table-grid'
    },
    imports: [NgForOf, NgClass, NgComponentOutlet, CommonModule, SelectOptionPipe, ThyTag],
    providers: [
        ThyPopover,
        {
            provide: THY_POPOVER_SCROLL_STRATEGY,
            deps: [Overlay],
            useFactory: thyPopoverScrollStrategyFactory
        }
    ]
})
export class VTableGridComponent implements OnInit {
    value = model.required<VTableValue>();

    gridConfig = input.required<GridConfig>();

    VTableFieldType = VTableFieldType;

    takeUntilDestroyed = takeUntilDestroyed();

    contextChange = output<{
        value: VTableValue;
        actions: VTableAction[];
    }>();

    vTable: Signal<VTable> = computed(() => {
        return createVTable(this.value);
    });

    gridValue = computed(() => {
        return buildGridData(this.value(), {
            id: this.value().id,
            type: VTableViewType.Grid
        });
    });

    constructor(
        private thyPopover: ThyPopover,
        private iconRegistry: ThyIconRegistry,
        private sanitizer: DomSanitizer,
        private elementRef: ElementRef<HTMLElement>
    ) {
        this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/defs/svg/sprite.defs.svg'));
        // 注册 symbol SVG 雪碧图
        this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/symbol/svg/sprite.defs.svg'));
        effect(() => {
            this.contextChange.emit({
                value: this.value(),
                actions: this.vTable().actions
            });
        });
    }

    ngOnInit(): void {
        this.initializeEventListener();
    }

    addRecord() {
        Actions.addRecord(this.vTable(), getDefaultRecord(this.value()), [this.value().records.length]);
    }

    getEditorComponent(type: VTableFieldType) {
        const cellRender = this.gridConfig()?.cellRenderer;
        if (cellRender && cellRender[type]) {
            return cellRender[type]!.edit;
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
        const { field, record } = getCellInfo(this.gridValue, fieldId, recordId);
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
                fieldId: signal(fieldId),
                field: field,
                record: record,
                vTable: this.vTable
            },
            panelClass: 'grid-cell-editor',
            outsideClosable: false,
            hasBackdrop: false,
            manualClosure: true,
            animationDisabled: true
        });
    }
}
