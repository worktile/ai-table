import { NgIf } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    HostListener,
    model,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ThyInputModule } from "ngx-tethys/input";
import { ThyAutofocusDirective } from "ngx-tethys/shared";
import { AbstractCell } from "../../core/abstract-cell";
import { UpdateOptions } from "../../../../types/core";



@Component({
    selector: "v-table-text2",
    template: `<span class="d-block">{{ value() }}</span>`,
    standalone: true,
    imports: [NgIf, FormsModule, ThyInputModule, ThyAutofocusDirective],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "text-column",
    },
})
export class TextComponent2 {
    value = model.required<any>();
    editable: boolean = false;

    constructor() {
    }

    // @HostListener("dblclick", ["$event"])
    // dblclick(event: MouseEvent) {
    //     if (!this.editable && !this.readonly()) {
    //         this.editable = true;
    //     }
    // }

    // updateTextValue() {
    //     this.editable = false;
    //     this.setValue(this.value(), false);
    // }
}

@Component({
    selector: "v-table-text",
    templateUrl: "./text.component.html",
    standalone: true,
    imports: [TextComponent2],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "text-column",
    },
})
export class TextComponent {
    value = model.required<any>();
    editable: boolean = false;

    constructor() {
    }

    // @HostListener("dblclick", ["$event"])
    // dblclick(event: MouseEvent) {
    //     if (!this.editable && !this.readonly()) {
    //         this.editable = true;
    //     }
    // }

    updateTextValue() {
        this.editable = false;
        // this.setValue(this.value(), false);
    }
}

