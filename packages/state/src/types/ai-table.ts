import { AITable } from "@ai-table/grid";
import { WritableSignal, Signal } from "@angular/core";
import { AITableAction } from "./action";
import { AITableView } from "./view";

export interface AIViewTable extends AITable {
    views: WritableSignal<AITableView[]>;
    activeViewId: WritableSignal<string>;
    viewsMap: Signal<{ [key: string]: AITableView }>;
    actions: AITableAction[];
    onChange: () => void;
    apply: (action: AITableAction) => void;
}
