import {
    Component,
    ChangeDetectionStrategy,
    OnInit,
    inject,
    effect,
    output,
    model,
    ElementRef,
} from "@angular/core";
import { ActionManager } from "../service";
import { ActionExecuteResult, VTableValue } from "../types";
import { fromEvent } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "v-table",
    template: "",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VTableComponent<TValue> implements OnInit {
    value = model.required<TValue>();

    takeUntilDestroyed = takeUntilDestroyed();

    contextChange = output<{
        value: TValue;
        action: ActionExecuteResult | null;
    }>();

    protected actionManager = inject(ActionManager<VTableValue>);

    protected elementRef = inject(ElementRef<HTMLElement>);

    constructor() {
        effect(() => {
            this.contextChange.emit({
                value: this.value(),
                action: this.actionManager.actionExecuteResult,
            });
        });
    }

    ngOnInit(): void {
        this.actionManager.init(this.value);
        this.initializeHookListener();
    }

    private initializeHookListener() {
        fromEvent<MouseEvent>(this.elementRef.nativeElement, "dblclick")
            .pipe(this.takeUntilDestroyed)
            .subscribe((event) => {
                this.dblClick(event as MouseEvent);
            });
        fromEvent<MouseEvent>(this.elementRef.nativeElement, "mousedown")
            .pipe(this.takeUntilDestroyed)
            .subscribe((event) => {
                this.mousedown(event as MouseEvent);
            });
    }

    dblClick(event: MouseEvent) {}

    mousedown(event: MouseEvent) {}
}
