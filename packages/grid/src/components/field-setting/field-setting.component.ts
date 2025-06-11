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
    SystemFieldTypes,
    isUndefinedOrNull,
    AITableSelectOption,
    AITableReferences,
    SelectSettings,
    AITableSelectOptionStyle,
    idCreator
} from '@ai-table/utils';
import { AITableFieldIsSameOptionPipe } from '../../pipes';
import * as _ from 'lodash';
import { AITableGridI18nKey, getI18nTextByKey } from '../../utils/i18n';
import { AITable, AITableQueries, createDefaultFieldName, getFieldOptionByField, getFieldOptions, isSystemField } from '../../core';
import { DEFAULT_COLORS } from 'ngx-tethys/color-picker';
import { FieldModelMap } from '../../utils';

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

    readonly setField = output<SetFieldOptions>();

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
            const name = this.isManualInputName() ? item.name : createDefaultFieldName(this.aiTable(), field);
            let settings = field.settings || {};
            if (this.isUpdate() && field.type === AITableFieldType.select) {
                settings = { ...settings, ...this.getSelectOptions(field) };
            }
            return { ...item, ...field, width, name, settings };
        });
        setTimeout(() => {
            this.thyPopoverRef.updatePosition();
        }, 0);
    }

    private getSelectOptions(field: AITableFieldOption) {
        const originField = this.aiEditField();
        const isOnlySwitchMultiple =
            originField.type === AITableFieldType.select &&
            (field.settings as SelectSettings)?.is_multiple !== (originField.settings as SelectSettings)?.is_multiple;

        let options: AITableSelectOption[] = [];
        let optionStyle: AITableSelectOptionStyle = AITableSelectOptionStyle.text;

        if (isOnlySwitchMultiple) {
            const settings = (originField.settings as SelectSettings) || {};
            options = settings.options;
            optionStyle = settings.option_style || AITableSelectOptionStyle.text;
        } else {
            const isMultiple = !!(field.settings as SelectSettings)?.is_multiple;
            options = this.generateSelectOptions(isMultiple);
        }

        return { options, optionStyle };
    }

    private generateSelectOptions(isMultiple: boolean): AITableSelectOption[] {
        const aiTable = this.aiTable();
        const references = this.aiReferences();
        const records = aiTable.records();
        const originField = this.aiEditField();
        const originFieldModel = FieldModelMap[originField.type!];

        let optionTexts: string[] = [];

        records.forEach((record) => {
            const cellValue = isSystemField(originField)
                ? AITableQueries.getSystemFieldValue(record, originField.type as SystemFieldTypes)
                : AITableQueries.getFieldValue(aiTable, [record._id, originField._id!]);

            const transformValue = originFieldModel.transformCellValue(cellValue, {
                aiTable,
                field: originField
            });

            const texts = originFieldModel.cellFullText(transformValue, originField, references);

            if (texts.length > 0) {
                if (isMultiple) {
                    optionTexts = [...optionTexts, ...texts];
                } else {
                    optionTexts = [...optionTexts, texts[0]];
                }
            }
        });

        optionTexts = optionTexts.filter((value) => {
            return !isUndefinedOrNull(value) && value !== '';
        });
        optionTexts = _.uniq(optionTexts);

        const options = optionTexts.map((value) => {
            const option = {
                _id: idCreator(),
                text: value,
                bg_color: DEFAULT_COLORS[10 + (optionTexts.length || 0)]
            };
            return option;
        });
        return options;
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
            confirm: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.confirm),
            base: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.fieldGroupBase),
            advanced: getI18nTextByKey(this.aiTable(), AITableGridI18nKey.fieldGroupAdvanced)
        };
    });
}
