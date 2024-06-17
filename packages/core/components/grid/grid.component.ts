import {
    ChangeDetectionStrategy,
    Component,
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
})
export class GridComponent implements OnInit {
    value = input.required<GridData>();

    options = input<any>();

    ColumnType = ColumnType;

    constructor(private actionManager: ActionManager<any>) {}

    ngOnInit(): void {
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
}
