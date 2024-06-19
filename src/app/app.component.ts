import { Component, OnInit, signal, WritableSignal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ColumnType, VTableComponent } from "../../packages/core";
import { ResourceType } from "../../packages/core/types/core";
import { SelectComponent } from "../../packages/core/components/grid/columns/select/select.component";
import { AfterViewInit } from "@angular/core";

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
    ],
    rows: [
        {
            id: "row-0",
            value: {
                "column-1": "文本 1-1",
                "column-2": "1",
                "column-3": "文本 1-1",
                "column-4": "1",
                "column-5": "文本 1-1",
                "column-6": "1",
                "column-7": "文本 1-1",
                "column-8": "1",
                "column-9": "文本 1-1",
                "column-10": "1",
            },
        },
    ],
};

console.time("build data");

initValue.columns = [];
for (let index = 0; index < 30; index++) {
    initValue.columns.push({
        id: `column-${index}`,
        name: "文本",
        type: ColumnType.text,
    });
}

initValue.rows = [];
for (let index = 0; index < 40 * 3 * 2; index++) {
    const value: any = {};
    initValue.columns.forEach((column, columnIndex) => {
        value[`${column.id}`] = `text-${index}-${columnIndex}`;
    });
    initValue.rows.push({
        id: `row-${index + 1}`,
        value: value,
    });
}

console.timeEnd("build data");

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, VTableComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit, AfterViewInit {
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

    constructor() {}

    ngOnInit(): void {
        console.time("render");
        this.value = signal(this.getLocalStorage());
    }

    ngAfterViewInit() {
        console.timeEnd("render");
    }

    change(value: any) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}`, JSON.stringify(value));
    }

    setLocalData(data: string) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}`, data);
    }

    getLocalStorage() {
        const data = localStorage.getItem(`${LOCAL_STORAGE_KEY}`);
        return data ? JSON.parse(data) : initValue;
    }
}
