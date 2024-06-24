import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    model,
    OnInit,
} from "@angular/core";
import {
    ActionManager,
    ActionName,
    UpdateFieldValueOptions,
    VTableField,
    VTableRecord,
    VTableValue,
    VTableViewType,
} from "../../../core";
import { ThyPopoverRef } from "ngx-tethys/popover";

@Component({
    selector: "abstract-cell",
    template: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractCellEditor<TValue, TFieldType extends VTableField = VTableField> implements OnInit {
    value = model.required<TValue>();

    field = input.required<TFieldType>();

    record = input.required<VTableRecord>();

    protected _previousData!: TValue;

    get previousData(): TValue {
        return this._previousData;
    }

    protected actionManager = inject(ActionManager<VTableValue>);

    protected thyPopoverRef = inject(ThyPopoverRef<AbstractCellEditor<TValue>>);

    ngOnInit(): void {
        this._previousData = this.value();
    }

    public setValue(value: TValue) {
        this.thyPopoverRef.close();
        if (this.previousData === value) {
            return;
        }
        const data = this.actionManager.value() as VTableValue;
        const recordIndex = data.records.indexOf(this.record());
        const fieldIndex = data.fields.indexOf(this.field());
        this.actionManager.execute<UpdateFieldValueOptions>({
            type: ActionName.UpdateFieldValue,
            path: [recordIndex, fieldIndex],
            data: this.value(),
            previousData: this._previousData,
            viewType: VTableViewType.Grid,
        });
        this._previousData = value;
    }
}
