import { Component, inject, input, model, output, computed, viewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { ThyButton } from 'ngx-tethys/button';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThySelect } from 'ngx-tethys/select';
import { ThyOption } from 'ngx-tethys/shared';
import { helpers } from 'ngx-tethys/util';
import { ThyInput } from 'ngx-tethys/input';
import { ThyInputNumber } from 'ngx-tethys/input-number';
import { ThyDatePicker } from 'ngx-tethys/date-picker';
import { ThyAction } from 'ngx-tethys/action';
import { ThyIcon } from 'ngx-tethys/icon';
import { ThyPopover } from 'ngx-tethys/popover';
import { ThyDialogHeader, ThyDialogBody, ThyDialogFooter } from 'ngx-tethys/dialog';
import { ComponentTypeOrTemplateRef } from 'ngx-tethys/core';
import {
    AITableField,
    AITableFieldType,
    AITableFilterCondition,
    AITableFilterConditions,
    AITableFilterLogical,
    AITableFilterOperation,
    Id
} from '@ai-table/utils';
import { ThyTooltipDirective } from 'ngx-tethys/tooltip';
import { ThyBadge } from 'ngx-tethys/badge';
import {
    SelectableFieldsExamplePipe,
    FieldOperationsExamplePipe,
    FieldOptionsExamplePipe,
    logics,
    fieldOperationsMap,
    operationLabelMap
} from './condition';

@Component({
    selector: 'app-condition-selector',
    templateUrl: './condition-selector.component.html',
    styleUrls: ['./condition-selector.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ThyIcon,
        ThyAction,
        ThyDialogBody,
        ThyDialogHeader,
        ThyDialogFooter,
        ThyButton,
        NgTemplateOutlet,
        ThySelect,
        ThyOption,
        ThyInput,
        ThyBadge,
        ThyInputNumber,
        ThyDatePicker,
        ThyTooltipDirective,
        SelectableFieldsExamplePipe,
        FieldOperationsExamplePipe,
        FieldOptionsExamplePipe
    ]
})
export class ConditionSelectorExample {
    readonly fields = input<AITableField[]>([]);

    readonly logic = model<AITableFilterLogical>(AITableFilterLogical.and);

    readonly conditions = model<AITableFilterCondition[]>([]);

    readonly conditionsChange = output<AITableFilterConditions>();

    readonly filterTemplate = viewChild<TemplateRef<any>>('filterPanel');

    private thyPopover = inject(ThyPopover);

    private viewContainerRef = inject(ViewContainerRef);

    public AITableFieldType = AITableFieldType;

    public AITableFilterOperation = AITableFilterOperation;

    public logics = logics;

    public fieldOperationsMap = fieldOperationsMap;

    public operationLabelMap = operationLabelMap;

    readonly fieldsMap = computed(() => {
        return helpers.keyBy(this.fields(), '_id');
    });

    openViewFilter(event: Event) {
        this.thyPopover.open(this.filterTemplate() as ComponentTypeOrTemplateRef<any>, {
            origin: event.currentTarget as HTMLElement,
            placement: 'bottomLeft',
            insideClosable: false,
            originActiveClass: 'active',
            viewContainerRef: this.viewContainerRef,
            width: '800px',
            maxHeight: '300px',
            initialState: {}
        });
    }

    removeCondition(condition: AITableFilterCondition) {
        const newConditions = this.conditions().filter((c) => c !== condition);
        this.conditions.set(newConditions);
    }

    addCondition(fieldId: Id) {
        const fieldType = this.fieldsMap()[fieldId].type as AITableFieldType;
        const operations = fieldOperationsMap[fieldType] ?? [];

        const newCondition: AITableFilterCondition = {
            field_id: fieldId,
            operation: operations[0]!,
            value: undefined
        };

        const newConditions = [...this.conditions(), newCondition];
        this.conditions.set(newConditions);
    }

    updateConditionFieldId(index: number, fieldId: Id) {
        const newConditions = [...this.conditions()];
        if (index >= 0 && index < newConditions.length) {
            const fieldType = this.fieldsMap()[fieldId].type as AITableFieldType;
            const operations = fieldOperationsMap[fieldType] ?? [];
            newConditions[index] = {
                ...newConditions[index],
                field_id: fieldId,
                operation: operations[0]!,
                value: undefined
            };
            this.conditions.set(newConditions);
        }
    }

    updateConditionOperation(index: number, operation: AITableFilterOperation) {
        const newConditions = [...this.conditions()];
        if (index >= 0 && index < newConditions.length) {
            newConditions[index] = { ...newConditions[index], operation };
            this.conditions.set(newConditions);
        }
    }

    updateConditionValue(index: number, value: unknown) {
        const newConditions = [...this.conditions()];
        if (index >= 0 && index < newConditions.length) {
            newConditions[index] = { ...newConditions[index], value };
            this.conditions.set(newConditions);
        }
    }

    ok() {
        const filterConditions: AITableFilterConditions = {
            conditions: this.conditions(),
            condition_logical: this.logic()
        };
        this.conditionsChange.emit(filterConditions);

        this.close();
    }

    close() {
        this.thyPopover.close();
    }
}
