import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    TemplateRef,
    booleanAttribute,
    computed,
    inject,
    input,
    model,
    output,
    signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyButton } from 'ngx-tethys/button';
import {
    ThyDropdownDirective,
    ThyDropdownMenuComponent,
    ThyDropdownMenuItemDirective,
    ThyDropdownMenuItemExtendIconDirective,
    ThyDropdownMenuItemIconDirective,
    ThyDropdownMenuItemNameDirective
} from 'ngx-tethys/dropdown';
import { ThyFormModule, ThyUniqueCheckValidator } from 'ngx-tethys/form';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyInputCount, ThyInputDirective, ThyInputGroup } from 'ngx-tethys/input';
import { ThySwitch } from 'ngx-tethys/switch';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { ThyAutofocusDirective } from 'ngx-tethys/shared';
import { of } from 'rxjs';
import { AITableField, AITableFieldOption, SetFieldOptions, AITableFieldType, MemberSettings } from '@ai-table/utils';
import { AITableFieldIsSameOptionPipe } from '../../pipes';
import * as _ from 'lodash';
import { AITableGridI18nKey, getI18nTextByKey } from '../../utils/i18n';
import { AITable, createDefaultFieldName, getFieldOptionByField, getFieldOptions } from '../../core';

@Component({
    selector: 'ai-table-field-setting',
    templateUrl: './field-setting.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgClass,
        FormsModule,
        ThyIcon,
        ThyInputGroup,
        ThyInputCount,
        ThyInputDirective,
        ThyUniqueCheckValidator,
        ThyDropdownMenuComponent,
        ThyDropdownDirective,
        ThyDropdownMenuItemDirective,
        ThyDropdownMenuItemIconDirective,
        ThyDropdownMenuItemNameDirective,
        ThyDropdownMenuItemExtendIconDirective,
        ThyButton,
        ThySwitch,
        ThyFormModule,
        NgTemplateOutlet,
        ThyAutofocusDirective,
        AITableFieldIsSameOptionPipe
    ],
    host: {
        class: 'field-setting d-block pl-5 pr-5 pb-5 pt-4'
    },
    styles: [
        `
            :host {
                width: 350px;
            }
        `
    ]
})
export class AITableFieldSetting implements OnInit {
    aiEditField = model.required<AITableField>();

    aiTable = input.required<AITable>();

    aiExternalTemplate = input<TemplateRef<any> | null>(null);

    isUpdate = input<boolean, unknown>(false, { transform: booleanAttribute });

    addField = output<AITableField>();

    setField = output<SetFieldOptions>();

    selectedFieldOption = computed(() => {
        return getFieldOptionByField(this.aiTable(), this.aiEditField())!;
    });

    fieldMaxLength = 32;

    validatorConfig = computed(() => {
        return {
            validationMessages: {
                fieldName: {
                    required: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.fieldNameRequired),
                    thyUniqueCheck: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.fieldNameDuplicate)
                }
            }
        };
    });

    fieldOptions = computed(() => {
        return getFieldOptions(this.aiTable());
    });

    aITableFieldType = AITableFieldType;

    isMultipleMember = false;

    private isManualInputName = signal(false);

    protected thyPopoverRef = inject(ThyPopoverRef<AITableFieldSetting>);

    ngOnInit(): void {
        this.isMultipleMember =
            this.aiEditField().type === AITableFieldType.member && !!(this.aiEditField().settings as MemberSettings)?.is_multiple;
    }

    checkUniqueName = (fieldName: string) => {
        fieldName = fieldName?.trim();
        return of(
            !!this.aiTable()
                .fields()
                ?.find((field) => field.name === fieldName && this.aiEditField()?._id !== field._id)
        );
    };

    selectFieldType(field: AITableFieldOption) {
        const fieldsSizeMap = this.aiTable().gridData().fieldsSizeMap;
        this.aiEditField.update((item) => {
            const width = fieldsSizeMap[item._id] ?? field.width;
            const settings = field.settings || {};
            const name = this.isManualInputName() ? item.name : createDefaultFieldName(this.aiTable(), field);
            return { ...item, ...field, width, name, settings };
        });
        setTimeout(() => {
            this.thyPopoverRef.updatePosition();
        }, 0);
    }

    editFieldProperty() {
        if (this.isUpdate()) {
            this.setField.emit({
                field: this.aiEditField(),
                path: [this.aiEditField()._id]
            });
        } else {
            this.addField.emit(this.aiEditField());
        }
        this.thyPopoverRef.close();
    }

    multipleMemberChange() {
        this.aiEditField.set({
            ...this.aiEditField(),
            settings: {
                ...(this.aiEditField().settings || {}),
                is_multiple: this.isMultipleMember
            }
        });
    }

    fieldTypeClick(e: Event) {
        e.preventDefault();
        e.stopPropagation();
    }

    nameChange(event: Event) {
        this.isManualInputName.set(true);
    }

    cancel() {
        this.thyPopoverRef.close();
    }

    i18nTexts = computed(() => {
        return {
            columnName: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.fieldColumnName),
            columnNamePlaceholder: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.fieldColumnNamePlaceholder),
            fieldType: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.fieldType),
            allowMultipleMembers: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.allowMultipleMembers),
            cancel: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.cancel),
            confirm: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.confirm)
        };
    });
}
