import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    model,
    OnInit,
} from "@angular/core";
import { ActionName } from "../../../types/actions";
import { ActionManager } from "../../../service/action-manage.service";

@Component({
    selector: "abstract-cell",
    template: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractCell<TValue> implements OnInit {
    value = model.required<TValue>();

    recordId = input.required<string>();

    fieldId = input.required<string>();

    selectOptions = input<any>();

    readonly = input(false);

    protected _previousData!: TValue;

    get previousData(): TValue {
        return this._previousData;
    }

    protected actionManager = inject(ActionManager<any>);

    ngOnInit(): void {
        this._previousData = this.value();
    }

    public setValue(value: TValue, silent?: boolean) {
        if (this._previousData === value) {
            return;
        }
        this._previousData = this.value();
        if (!silent) {
            this.actionManager.execute<TValue>({
                type: ActionName.UpdateFieldValue,
                recordId: this.recordId(),
                fieldId: this.fieldId(),
                data: this.value(),
                previousData: this._previousData,
            });
        }
    }
}
