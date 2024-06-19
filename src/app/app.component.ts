import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    model,
    OnInit,
    signal,
    WritableSignal,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ColumnType, VTableComponent } from "../../packages/core";
import { ResourceType } from "../../packages/core/types/core";
import { SelectComponent } from "../../packages/core/components/grid/columns/select/select.component";

const LOCAL_STORAGE_KEY = "v-table-data";

const initValue = {
    id: "grid",
    name: "表格视图",
    type: ResourceType.grid,
    columns: [
        {
            id: "column-1",
            name: "文本",
            type: ColumnType.text,
        },
        {
            id: "column-2",
            name: "单选",
            type: ColumnType.select,
            options: [
                {
                    value: "1",
                    name: "开始",
                    color: "#5dcfff",
                },
                {
                    value: "2",
                    name: "进行中",
                    color: "#ffcd5d",
                },
                {
                    value: "3",
                    name: "已完成",
                    color: "#73d897",
                },
            ],
        },
    ],
    rows: [
        {
            id: "row-1",
            value: {
                "column-1": "文本 1-1",
                "column-2": "1",
            },
        },
        {
            id: "row-2",
            value: {
                "column-1": "文本 2-1",
                "column-2": "2",
            },
        },
        {
            id: "row-3",
            value: {
                "column-1": "文本 3-1",
                "column-2": "3",
            },
        },
    ],
};
@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, VTableComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
    value!: WritableSignal<any>;

    options = {
        grid: {
            componentMap: {
                [ColumnType.select]: {
                    component: SelectComponent,
                },
            },
        },
    };

    constructor(public cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.value = signal(this.getLocalStorage());
    }

    change(value: any) {
        this.value.set(value);
        localStorage.setItem(`${LOCAL_STORAGE_KEY}`, JSON.stringify(value));
        this.cdr.detectChanges();

    }

    getLocalStorage() {
        const data = localStorage.getItem(`${LOCAL_STORAGE_KEY}`);
        return data ? JSON.parse(data) : initValue;
    }
}
