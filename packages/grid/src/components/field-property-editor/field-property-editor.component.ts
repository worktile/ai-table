import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, computed, inject, model } from '@angular/core';
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
import { AITable, AITableField, AITableFieldType, AITableQueries, Actions, Fields, FieldsMap, createDefaultFieldName } from '../../core';
import { ThyIcon } from 'ngx-tethys/icon';
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
export class AITableFieldPropertyEditor {
    aiField = model.required<AITableField>();

    @Input() aiTable!: AITable;

    @Input() aiExternalTemplate: TemplateRef<any> | null = null;

    @Input() isUpdate!: boolean;

    fieldType = computed(() => {
        return FieldsMap[this.aiField().type];
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

    selectableFields = Fields;

    protected thyPopoverRef = inject(ThyPopoverRef<AITableFieldPropertyEditor>);

    constructor() {}

    checkUniqueName = (fieldName: string) => {
        fieldName = fieldName?.trim();
        return of(!!this.aiTable.fields()?.find((field) => field.name === fieldName && this.aiField()?.id !== field.id));
    };

    selectFieldType(fieldType: AITableFieldType) {
        this.aiField.update((item) => ({ ...item, type: fieldType, name: createDefaultFieldName(this.aiTable, fieldType) }));
    }

    editFieldProperty() {
        if (this.isUpdate) {
            //TODO: updateField
        } else {
            Actions.addField(this.aiTable, this.aiField(), [this.aiTable.fields().length]);
        }
        this.thyPopoverRef.close();
    }

    cancel() {
        this.thyPopoverRef.close();
    }
}
