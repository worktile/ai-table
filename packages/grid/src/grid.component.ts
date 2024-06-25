import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    input,
    model,
    signal,
    viewChild,
} from "@angular/core";
import {
    CommonModule,
    NgClass,
    NgComponentOutlet,
    NgForOf,
} from "@angular/common";
import { GridConfig, GridData } from "./types";

import { SelectOptionPipe } from "./pipes/grid";
import { ThyTag } from "ngx-tethys/tag";
import { GRID_CELL_EDITOR_MAP } from "./constants/editor";
import { THY_POPOVER_SCROLL_STRATEGY, ThyPopover } from "ngx-tethys/popover";
import { Overlay } from "@angular/cdk/overlay";
import { thyPopoverScrollStrategyFactory } from "./utils/global";
import { getCellInfo } from "./utils/cell";
import { DomSanitizer } from "@angular/platform-browser";
import { ThyIconRegistry } from "ngx-tethys/icon";
import { DBL_CLICK_EDIT_TYPE } from "./constants";
import {
    ActionName,
    idCreator,
    VTableComponent,
    VTableFieldType,
    VTableViewType,
    V_TABLE_ACTION_MAP_TOKEN,
    addRecord,
    ActionManager,
} from "@v-table/core";

@Component({
    selector: "v-table-grid",
    templateUrl: "./grid.component.html",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "v-table-grid",
    },
    imports: [
        NgForOf,
        NgClass,
        NgComponentOutlet,
        CommonModule,
        SelectOptionPipe,
        ThyTag,
    ],
    providers: [
        ThyPopover,
        {
            provide: THY_POPOVER_SCROLL_STRATEGY,
            deps: [Overlay],
            useFactory: thyPopoverScrollStrategyFactory,
        },
        ActionManager,
        // extend action
        // {
        //     provide: V_TABLE_ACTION_MAP_TOKEN,
        //     useValue: {
        //         [ActionName.AddRecord]: addRecord,
        //     },
        // },
    ],
})
export class VTableGridComponent extends VTableComponent<GridData> {
    override value = model.required<GridData>();

    gridConfig = input<GridConfig>();

    VTableFieldType = VTableFieldType;

    activeBorder = viewChild<ElementRef>("activeBorder");

    constructor(
        private thyPopover: ThyPopover,
        private iconRegistry: ThyIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
        super();
        this.iconRegistry.addSvgIconSet(
            this.sanitizer.bypassSecurityTrustResourceUrl(
                "assets/icons/defs/svg/sprite.defs.svg",
            ),
        );
        // 注册 symbol SVG 雪碧图
        this.iconRegistry.addSvgIconSet(
            this.sanitizer.bypassSecurityTrustResourceUrl(
                "assets/icons/symbol/svg/sprite.defs.svg",
            ),
        );
    }

    addRecord() {
        this.actionManager.execute({
            type: ActionName.AddRecord,
            path: [this.value().records.length],
            viewType: VTableViewType.Grid,
            data: {
                id: idCreator(),
            },
        });
    }

    getEditorComponent(type: VTableFieldType) {
        const cellRender = this.gridConfig()?.cellRenderer;
        if (cellRender && cellRender[type]) {
            return cellRender[type]!.edit;
        }
        return GRID_CELL_EDITOR_MAP[type];
    }

    getViewComponent(type: VTableFieldType) {
        const cellRender = this.gridConfig()?.cellRenderer;
        if (cellRender && cellRender[type]) {
            return cellRender[type]!.view;
        }
        return null;
    }

    override dblClick(event: MouseEvent): void {
        const cellDom = (event.target as HTMLElement).closest(
            ".grid-cell",
        ) as HTMLElement;
        const type = cellDom && cellDom.getAttribute("type")!;
        if (type && DBL_CLICK_EDIT_TYPE.includes(Number(type))) {
            this.openEdit(cellDom);
        }
    }

    openEdit(cellDom: HTMLElement) {
        const { x, y, width, height } = cellDom.getBoundingClientRect();
        const fieldId = cellDom.getAttribute("fieldId")!;
        const recordId = cellDom.getAttribute("recordId")!;
        const { field, record } = getCellInfo(this.value(), fieldId, recordId);
        const component = this.getEditorComponent(field.type);
        this.thyPopover.open(component, {
            origin: cellDom,
            originPosition: {
                x: x - 1,
                y: y + 1,
                width: width + 2,
                height: height + 2,
            },
            width: width + 2 + "px",
            height: height + 2 + "px",
            placement: "top",
            offset: -(height + 4),
            initialState: {
                value: signal(record.value[fieldId]),
                field: signal(field),
                record: signal(record),
            },
            panelClass: "grid-cell-editor",
            outsideClosable: false,
            hasBackdrop: false,
            manualClosure: true,
            animationDisabled: true,
        });
    }

    override mousedown(event: MouseEvent) {
        const cellDom = (event.target as HTMLElement).closest(".grid-cell");
        const activeCells = (
            this.elementRef.nativeElement as HTMLElement
        ).querySelectorAll(".cell-active");
        Array.from(activeCells).forEach((item) => {
            item.classList.remove("cell-active");
        });
        if (cellDom) {
            cellDom.classList.add("cell-active");
        }
    }
}
