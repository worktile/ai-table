import { NgForOf, NgIf } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    HostListener,
    input,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AbstractCell } from "../../core/abstract-cell";
import { UpdateOptions } from "../../../../types/core";
import { ThySelect } from "ngx-tethys/select";
import { SelectedOptionPipe } from "../../../../pipes";
import { ThyTag } from "ngx-tethys/tag";
import { ThyIcon, ThyIconModule, ThyIconRegistry } from "ngx-tethys/icon";
import { ThyOption } from "ngx-tethys/shared";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: "v-table-select",
    templateUrl: "./select.component.html",
    standalone: true,
    imports: [
        NgIf,
        NgForOf,
        FormsModule,
        ThySelect,
        ThyOption,
        SelectedOptionPipe,
        ThyTag,
        ThyIcon
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "select-column",
    },
    providers: [ThyIconRegistry, SelectedOptionPipe],
})
export class SelectComponent extends AbstractCell<string> {
    override selectOptions = input.required<any>();

    editable: boolean = false;

    selectedOption = computed(() =>
        this.SelectedOptionPipe.transform(this.value(), this.selectOptions())
    );

    constructor(private SelectedOptionPipe: SelectedOptionPipe, 
        private iconRegistry: ThyIconRegistry,
        private sanitizer: DomSanitizer
    ) {
        super();
        this.iconRegistry.addSvgIconSet(
            this.sanitizer.bypassSecurityTrustResourceUrl(
                "assets/icons/defs/svg/sprite.defs.svg"
            )
        );
        // 注册 symbol SVG 雪碧图
        this.iconRegistry.addSvgIconSet(
            this.sanitizer.bypassSecurityTrustResourceUrl(
                "assets/icons/symbol/svg/sprite.defs.svg"
            )
        );
    }

    @HostListener("dblclick", ["$event"])
    dblclick(event: MouseEvent) {
        if (!this.editable && !this.readonly()) {
            this.editable = true;
        }
    }

    updateValue(event: boolean) {
        if (!event) {
            this.editable = false;
            this.setValue(
                this.value(),
                false
            );
        }
    }
}
