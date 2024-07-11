import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, WritableSignal, computed, inject, input, signal } from '@angular/core';
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
import { of } from 'rxjs';
import { AITableField, AITableFieldType, AITableFields, idCreator } from '../../core';
import { ThyIcon } from 'ngx-tethys/icon';
import { FieldTypes, FieldTypesMap } from '../../core/constants/field';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { ThyListItem } from 'ngx-tethys/list';

@Component({
    selector: 'app-field-config',
    templateUrl: './field-config.component.html',
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
        ThyListItem
    ],
    host: {
        class: 'field-config d-block pl-5 pr-5 pb-5 pt-4'
    },
    styles: [
        `
            :host {
                width: 350px;
            }
        `
    ]
})
export class FieldConfigComponent implements OnInit {
    fields = input.required<AITableFields>();

    @Input({ required: true }) confirmAction: ((field: AITableField) => void) | null = null;

    field: WritableSignal<AITableField> = signal({ id: idCreator(), type: AITableFieldType.Text, name: '' });

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

    protected thyPopoverRef = inject(ThyPopoverRef<FieldConfigComponent>);

    constructor() {}

    ngOnInit() {}

    checkUniqueName = (fieldName: string) => {
        fieldName = fieldName?.trim();
        return of(!!this.fields()?.find((field) => field.name === fieldName));
    };

    selectFieldType(fieldType: AITableFieldType) {
        this.field.update((item) => ({ ...item, type: fieldType }));
    }

    addField() {
        this.confirmAction!(this.field());
        this.thyPopoverRef.close();
    }

    cancel() {
        this.thyPopoverRef.close();
    }
}
