import { ChangeDetectionStrategy, Component, OnInit, booleanAttribute, inject, input, model, output } from '@angular/core';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { AITableField, SetFieldOptions, AITableReferences } from '@ai-table/utils';
import { AITable } from '../../core';

@Component({
    selector: 'ai-table-field-setting-base',
    template: ` <ng-content></ng-content> `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AITableFieldSettingBase implements OnInit {
    aiEditField = model.required<AITableField>();

    readonly aiTable = input.required<AITable>();

    readonly aiReferences = input<AITableReferences>();

    readonly isUpdate = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly addField = output<AITableField>();

    readonly setField = output<{ fieldOptions: SetFieldOptions; isSwitchType: boolean }>();

    protected originField?: AITableField;

    protected thyPopoverRef = inject(ThyPopoverRef<unknown>);

    ngOnInit(): void {
        this.originField = this.aiEditField();
    }

    editFieldProperty() {
        if (this.isUpdate()) {
            const originFieldType = this.originField?.type;
            this.setField.emit({
                fieldOptions: {
                    field: this.aiEditField(),
                    path: [this.aiEditField()._id]
                },
                isSwitchType: !!originFieldType && this.aiEditField().type !== originFieldType
            });
        } else {
            this.addField.emit(this.aiEditField());
        }
        this.thyPopoverRef.close();
    }

    cancel() {
        this.thyPopoverRef.close();
    }
}
