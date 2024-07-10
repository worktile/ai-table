import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, WritableSignal, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyInput, ThyInputCount, ThyInputGroup, ThyInputDirective } from 'ngx-tethys/input';
import {
    ThyFormDirective,
    ThyFormGroup,
    ThyConfirmValidatorDirective,
    ThyUniqueCheckValidator,
    ThyFormValidatorConfig,
    ThyFormValidatorLoader,
    THY_FORM_CONFIG_PROVIDER,
    ThyFormGroupFooter
} from 'ngx-tethys/form';
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
        ThyFormDirective,
        ThyFormGroup,
        ThyFormGroupFooter,
        ThyConfirmValidatorDirective,
        ThyUniqueCheckValidator,
        ThyDropdownDirective,
        ThyDropdownMenuComponent,
        ThyDropdownMenuItemDirective,
        ThyDropdownMenuItemNameDirective,
        ThyDropdownMenuItemIconDirective,
        ThyButton
    ],
    providers: [ThyFormValidatorLoader, THY_FORM_CONFIG_PROVIDER],
    host: {
        class: 'd-block p-4'
    }
})
export class FieldConfigComponent implements OnInit {
    fieldMaxLength = 32;

    @Input({ required: true }) fields: AITableFields | null = null;

    @Input({ required: true }) confirmAction: ((field: AITableField) => void) | null = null;

    field: WritableSignal<AITableField> = signal({ id: idCreator(), type: AITableFieldType.Text, name: '' });

    fieldType = computed(() => {
        return FieldTypesMap[this.field().type];
    });

    validatorConfig: ThyFormValidatorConfig = {
        validationMessages: {
            fieldName: {
                required: '列名不能为空',
                thyUniqueCheck: '不能与其他列重名'
            }
        }
    };

    selectableFields = FieldTypes;

    protected thyPopoverRef = inject(ThyPopoverRef<FieldConfigComponent>);

    constructor() {}

    ngOnInit() {}

    checkUniqueName = (fieldName: string) => {
        fieldName = fieldName?.trim();
        return of(!!this.fields?.find((field) => field.name === fieldName));
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
