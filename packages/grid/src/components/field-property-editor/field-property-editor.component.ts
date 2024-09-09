import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, TemplateRef, booleanAttribute, computed, inject, model } from '@angular/core';
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
import { AITable, AITableField, Actions, FieldOptions, createDefaultFieldName, AITableFieldOption, getFieldOptionByField } from '../../core';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { ThyListItem } from 'ngx-tethys/list';
import { of } from 'rxjs';
import { ThyAutofocusDirective } from 'ngx-tethys/shared';

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
        NgTemplateOutlet,
        ThyAutofocusDirective
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
export class AITableFieldPropertyEditor {
    aiEditField = model.required<AITableField>();

    @Input({ required: true }) aiTable!: AITable;

    @Input() aiExternalTemplate: TemplateRef<any> | null = null;

    @Input({ transform: booleanAttribute }) isUpdate!: boolean;

    selectedFieldOption = computed(() => {
        return getFieldOptionByField(this.aiEditField())!
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

    fieldOptions = FieldOptions;

    protected thyPopoverRef = inject(ThyPopoverRef<AITableFieldPropertyEditor>);

    checkUniqueName = (fieldName: string) => {
        fieldName = fieldName?.trim();
        return of(!!this.aiTable.fields()?.find((field) => field.name === fieldName && this.aiEditField()?._id !== field._id));
    };

    selectFieldType(field: AITableFieldOption) {
        this.aiEditField.update((item) => {
            const width = item.width ?? field.width;
            const settings = field.settings || {};
            const name = createDefaultFieldName(this.aiTable, field);
            return { ...item, ...field, width, name, settings };
        });
    }

    editFieldProperty() {
        if (this.isUpdate) {
            Actions.setField(this.aiTable, this.aiEditField(), [this.aiEditField()._id]);
        } else {
            Actions.addField(this.aiTable, this.aiEditField(), [this.aiTable.fields().length]);
        }
        this.thyPopoverRef.close();
    }

    cancel() {
        this.thyPopoverRef.close();
    }
}
