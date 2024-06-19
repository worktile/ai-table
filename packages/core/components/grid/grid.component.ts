import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    OnInit,
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
import { ActionName } from "../../types/actions";
import { ActionManager } from "../../service/action-manage.service";
import { idCreator } from "../../utils";
import { GridColumnMap } from "../../constants/grid";
import { getNewRecord } from "../../action/add-record";

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

    ngOnInit(): void {}

    addRow() {
        const id = idCreator();
        this.actionManager.execute({
            type: ActionName.AddRecord,
            data: {
                index: this.value().rows.length,
                value: getNewRecord(this.value(), id),
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
