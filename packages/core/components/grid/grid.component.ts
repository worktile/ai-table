import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    input,
    OnInit,
    output,
} from "@angular/core";
import {
    CommonModule,
    NgClass,
    NgComponentOutlet,
    NgForOf,
} from "@angular/common";
import { TextComponent } from "./columns/text/text.component";
import { ColumnPropertiesPipe } from "../../pipes";
import { ColumnType, GridData } from "../../types";
import { SelectComponent } from "./columns/select/select.component";
import { GridCellComponent } from "./columns/grid-cell";
import { ActionName } from "../../types/actions";
import { ActionManager } from "../../service/action-manage.service";
import { idCreator } from "../../utils";
import { GridColumnMap } from "../../constants/grid";

@Component({
    selector: "grid",
    templateUrl: "./grid.component.html",
    standalone: true,
    imports: [
        NgForOf,
        ColumnPropertiesPipe,
        TextComponent,
        SelectComponent,
        NgClass,
        NgComponentOutlet,
        CommonModule,
        GridCellComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ColumnPropertiesPipe],
})
export class GridComponent implements OnInit {
    value = input.required<GridData>();

    options = input<any>();

    ColumnType = ColumnType;

    rows = computed(() => {
        return this.value().rows.map((row) => {
            return {
                id: row.id,
                data: this.columnProperties.transform(
                    row.value,
                    this.value().columns
                ),
            };
        });
    });

    constructor(
        private actionManager: ActionManager<any>,
        private columnProperties: ColumnPropertiesPipe
    ) {}

    ngOnInit(): void {
    }

    clickHandle() {
        
    }

    addRow() {
        this.actionManager.execute({
            type: ActionName.AddRecord,
            data: {
                id: idCreator(),
            },
        });
    }

    addColumn() {
        this.actionManager.execute({
            type: ActionName.AddColumn,
            data: {
                id: idCreator(),
                type: ColumnType.text,
                name: "新增文本",
            },
        });
    }


    getComponent(type: ColumnType) {
        const componentMap = {
            ...GridColumnMap,
            ...this.options().grid.componentMap,
        };
        return componentMap[type].component;
    }
}
