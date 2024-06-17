import {
    ChangeDetectionStrategy,
    Component,
    input,
    OnInit,
    output,
} from "@angular/core";
import { GridComponent } from "./components/grid/grid.component";
import { TableData } from "./types";
import { SelectComponent } from "./components/grid/columns/select/select.component";
import { ThyIconRegistry } from "ngx-tethys/icon";
import { SharedType } from "./utils/convert";
import { getSharedType } from "./utils/yjs";
import { ActionManager } from "./service/action-manage.service";

@Component({
    selector: "v-table",
    templateUrl: "./v-table.component.html",
    standalone: true,
    imports: [GridComponent, SelectComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ThyIconRegistry],
})
export class VTableComponent implements OnInit {
    value = input.required<TableData>();

    options = input.required<any>();

    change = output<TableData>();

    isInitializeSharedType = false;

    sharedType!: SharedType;

    constructor(private actionManager: ActionManager<any>) {}

    ngOnInit(): void {
        this.initSharedType();
        this.actionManager.init(this.value(), this.sharedType);
        this.actionManager.change$.subscribe({
            next: (value) => {
                this.change.emit(value);
            },
        });
    }

    initSharedType() {
        this.sharedType = getSharedType(
            this.value(),
            !this.isInitializeSharedType
        );
        this.sharedType.observeDeep((events: any) => {
            console.log(123, events);
            // if (!YjsEditor.isLocal(e)) {
            //   const isNormalizing = Editor.isNormalizing(editor);
            //   Editor.setNormalizing(e, false);
            //   if (!isInitialized) {
            //     e.children = e.sharedType.toJSON();
            //     isInitialized = true;
            //     setTimeout(()=>{
            //       e.onChange();
            //     });
            //   } else {
            //     YjsEditor.applyYjsEvents(e, events);
            //   }
            //   Editor.setNormalizing(e, isNormalizing);
            // }
        });
        this.isInitializeSharedType = true;
    }
}
