import { AITable } from "@ai-table/grid";
import { WritableSignal } from "@angular/core";
import { ViewTableAction } from "../action/view";

export interface AIViewTable extends AITable {
    views: WritableSignal<any>;
    applyView: (action: ViewTableAction) => void;
}