import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    TemplateRef,
    WritableSignal,
    computed,
    inject,
    output,
    signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyInput, ThyInputCount, ThyInputGroup, ThyInputDirective } from 'ngx-tethys/input';
import { ThyConfirmValidatorDirective, ThyUniqueCheckValidator, ThyFormValidatorConfig, ThyFormModule } from 'ngx-tethys/form';
import {
    ThyDropdownDirective,
    ThyDropdownMenuComponent,
    ThyDropdownMenuItemDirective,
    ThyDropdownMenuItemNameDirective,
    ThyDropdownMenuItemIconDirective
} from 'ngx-tethys/dropdown';
import { ThyButton } from 'ngx-tethys/button';
import { AITable, AITableField, AITableFieldType, Actions, idCreator } from '../../core';
import { ThyIcon } from 'ngx-tethys/icon';
import { FieldTypes, FieldTypesMap } from '../../core/constants/field';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { ThyListItem } from 'ngx-tethys/list';
import { of } from 'rxjs';

@Component({
    selector: 'ai-table-field-property-editor',
    templateUrl: './field-property-editor.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        NgForOf,
        FormsModule,
        ThyIcon,
        ThyInput,
        ThyInputGroup,
        ThyInputCount,
        ThyInputDirective,
        ThyConfirmValidatorDirective,
        ThyUniqueCheckValidator,
        ThyDropdownDirective,
        ThyDropdownMenuComponent,
        ThyDropdownMenuItemDirective,
        ThyDropdownMenuItemNameDirective,
        ThyDropdownMenuItemIconDirective,
        ThyButton,
        ThyFormModule,
        ThyListItem,
        NgTemplateOutlet
    ],
    host: {
        class: 'field-property-editor d-block pl-5 pr-5 pb-5 pt-4'
    },
    styles: [
        `
            :host {
                width: 350px;
            }
        `
    ]
})
export class AITableFieldPropertyEditor implements OnInit {
    @Input() aiTable!: AITable;

    @Input() aiField!: AITableField;

    @Input() aiExternalTemplate: TemplateRef<any> | null = null;

    aiFieldInitialized = output<WritableSignal<AITableField>>();

    field!: WritableSignal<AITableField>;

    fieldType = computed(() => {
        return FieldTypesMap[this.field().type];
    });

    fieldMaxLength = 32;

    validatorConfig: ThyFormValidatorConfig = {
        validationMessages: {
            fieldName: {
                required: '列名不能为空',
                thyUniqueCheck: '列名已存在'
            }
        }
    };

    selectableFields = FieldTypes;

    protected thyPopoverRef = inject(ThyPopoverRef<AITableFieldPropertyEditor>);

    constructor() {}

    ngOnInit() {
        if (this.aiField) {
            this.field = signal(this.aiField);
        } else {
            this.field = signal({ id: idCreator(), type: AITableFieldType.Text, name: '' });
        }
        this.aiFieldInitialized.emit(this.field);
    }

    checkUniqueName = (fieldName: string) => {
        fieldName = fieldName?.trim();
        return of(!!this.aiTable.fields()?.find((field) => field.name === fieldName && this.aiField?.id !== field.id));
    };

    selectFieldType(fieldType: AITableFieldType) {
        this.field.update((item) => ({ ...item, type: fieldType }));
    }

    editFieldProperty() {
        if (this.aiField) {
            //TODO: updateField
        } else {
            Actions.addField(this.aiTable, this.field(), [this.aiTable.fields().length]);
        }
        this.thyPopoverRef.close();
    }

    cancel() {
        this.thyPopoverRef.close();
    }
}
