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
    ThyDropdownMenuGroup,
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
import {
    AITableField,
    AITableFieldOption,
    SetFieldOptions,
    AITableFieldType,
    MemberSettings,
    AITableReferences,
    isUndefinedOrNull
} from '@ai-table/utils';
import { AITableFieldIsSameOptionPipe } from '../../pipes';
import * as _ from 'lodash';
import { AITableGridI18nKey, getI18nTextByKey } from '../../utils/i18n';
import { AITable, createDefaultFieldName, getFieldOptionByField, getFieldOptions } from '../../core';
import { getOptionsByFieldAndRecords } from '../../utils';

@Component({
    selector: 'ai-table-field-setting',
    templateUrl: './field-setting.component.html',
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
        ThyDropdownMenuGroup,
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

    readonly aiTable = input.required<AITable>();

    readonly aiExternalTemplate = input<TemplateRef<any> | null>(null);

    readonly aiReferences = input<AITableReferences>();

    readonly isUpdate = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly addField = output<AITableField>();

    readonly setField = output<{ fieldOptions: SetFieldOptions; isSwitchType: boolean }>();

    readonly selectedFieldOption = computed(() => {
        return getFieldOptionByField(this.aiTable(), this.aiEditField())!;
    });

    fieldMaxLength = 32;

    readonly validatorConfig = computed(() => {
        return {
            validationMessages: {
                fieldName: {
                    required: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.fieldNameRequired),
                    thyUniqueCheck: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.fieldNameDuplicate)
                }
            }
        };
    });

    readonly fieldOptions = computed<{
        base: AITableFieldOption[];
        advanced: AITableFieldOption[];
    }>(() => {
        const fieldOptions = getFieldOptions(this.aiTable());
        return _.groupBy(fieldOptions, 'group') as {
            base: AITableFieldOption[];
            advanced: AITableFieldOption[];
        };
    });

    aITableFieldType = AITableFieldType;

    isMultipleMember = false;

    private isManualInputName = signal(false);

    private originFieldType?: AITableFieldType | string;

    protected thyPopoverRef = inject(ThyPopoverRef<AITableFieldSetting>);

    ngOnInit(): void {
        this.originFieldType = this.aiEditField()?.type;

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
            const name = this.isManualInputName() ? item.name : createDefaultFieldName(this.aiTable(), field);
            let settings = field.settings || {};

            if (this.isUpdate() && field.type === AITableFieldType.select) {
                const { options, optionStyle } = getOptionsByFieldAndRecords(this.aiTable(), this.aiEditField(), this.aiReferences()!);

                const maxCount = this.aiTable().context?.maxSelectOptions();
                let selectOptions = options;
                if (!isUndefinedOrNull(maxCount) && options.length > maxCount!) {
                    selectOptions = options.slice(0, maxCount!);
                }

                settings = {
                    ...settings,
                    options: selectOptions,
                    option_style: optionStyle
                };
            }

            return { ...item, ...field, width, name, settings };
        });
        setTimeout(() => {
            this.thyPopoverRef.updatePosition();
        }, 0);
    }

    editFieldProperty() {
        if (this.isUpdate()) {
            this.setField.emit({
                fieldOptions: {
                    field: this.aiEditField(),
                    path: [this.aiEditField()._id]
                },
                isSwitchType: !!this.originFieldType && this.aiEditField().type !== this.originFieldType
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
            confirm: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.confirm),
            base: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.fieldGroupBase),
            advanced: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.fieldGroupAdvanced)
        };
    });
}
