import {
    ChangeDetectionStrategy,
    Component,
    ComponentRef,
    input,
    OnInit,
    viewChild,
    ViewContainerRef,
} from "@angular/core";
import { AbstractCell } from "../core/abstract-cell";
import { GridColumnMap } from "../../../constants/grid";
import { ColumnType } from "../../../types";

@Component({
    selector: "grid-cell",
    template: `<ng-container #container></ng-container>`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "grid-cell",
    },
})
export class GridCellComponent extends AbstractCell<any> implements OnInit {
    //TODO: type
    gridOptions = input<any>();

    type = input.required<ColumnType>();

    container = viewChild("container", { read: ViewContainerRef });

    constructor() {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.createComponent();
    }

    createComponent() {
        const componentMap = {
            ...GridColumnMap,
            ...this.gridOptions().componentMap,
        };
        const component: ComponentRef<any> = this.container()!.createComponent(
            componentMap[this.type()].component
        );
        if (component) {
            component.setInput("value", this.value());
            component.setInput("recordId", this.recordId());
            component.setInput("fieldId", this.fieldId());
            component.setInput("readonly", this.readonly());
            component.setInput("selectOptions", this.selectOptions());
        }
    }
}
