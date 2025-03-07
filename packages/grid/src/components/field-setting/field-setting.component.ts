import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    TemplateRef,
    booleanAttribute,
    computed,
    inject,
    model,
    output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThyButton } from 'ngx-tethys/button';
import {
    ThyDropdownDirective,
    ThyDropdownMenuComponent,
    ThyDropdownMenuItemDirective,
    ThyDropdownMenuItemNameDirective
} from 'ngx-tethys/dropdown';
import { ThyFormModule, ThyFormValidatorConfig, ThyUniqueCheckValidator } from 'ngx-tethys/form';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyInputCount, ThyInputDirective, ThyInputGroup } from 'ngx-tethys/input';
import { ThySwitch } from 'ngx-tethys/switch';
import { ThyListItem } from 'ngx-tethys/list';
import { ThyPopoverRef } from 'ngx-tethys/popover';
import { ThyAutofocusDirective } from 'ngx-tethys/shared';
import { of } from 'rxjs';
import {
    AITable,
    AITableField,
    AITableFieldOption,
    FieldOptions,
    createDefaultFieldName,
    getFieldOptionByField,
    SetFieldOptions,
    AITableFieldType,
    MemberSettings
} from '../../core';
import { AITableFieldIsSameOptionPipe } from '../../pipes';
import * as _ from 'lodash';

@Component({
    selector: 'ai-table-field-setting',
    templateUrl: './field-setting.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        NgClass,
        FormsModule,
        ThyIcon,
        ThyInputGroup,
        ThyInputCount,
        ThyInputDirective,
        ThyUniqueCheckValidator,
        ThyDropdownDirective,
        ThyDropdownMenuComponent,
        ThyDropdownMenuItemDirective,
        ThyDropdownMenuItemNameDirective,
        ThyButton,
        ThySwitch,
        ThyFormModule,
        ThyListItem,
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

    @Input({ required: true }) aiTable!: AITable;

    @Input() aiExternalTemplate: TemplateRef<any> | null = null;

    @Input({ transform: booleanAttribute }) isUpdate!: boolean;

    addField = output<AITableField>();

    setField = output<SetFieldOptions>();

    selectedFieldOption = computed(() => {
        return getFieldOptionByField(this.aiEditField())!;
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

    fieldOptions = _.cloneDeep(FieldOptions);

    aITableFieldType = AITableFieldType;

    isEdit = false;

    isMultipleMember = false;

    protected thyPopoverRef = inject(ThyPopoverRef<AITableFieldSetting>);

    ngOnInit(): void {
        this.isEdit = !!this.aiEditField()?._id;
        this.isMultipleMember =
            this.aiEditField().type === AITableFieldType.member && !!(this.aiEditField().settings as MemberSettings)?.is_multiple;
    }

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
        setTimeout(() => {
            this.thyPopoverRef.updatePosition();
        }, 0);
    }

    editFieldProperty() {
        if (this.isUpdate) {
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

    cancel() {
        this.thyPopoverRef.close();
    }
}
