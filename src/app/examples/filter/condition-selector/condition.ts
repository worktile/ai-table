import {
    AITableField,
    AITableFilterCondition,
    AITableFilterOperation,
    AITableFieldType,
    Id,
    AITableSelectOption,
    SelectSettings,
    AITableFilterLogical
} from '@ai-table/utils';
import { helpers } from 'ngx-tethys/util';
import { Pipe, PipeTransform } from '@angular/core';

export const logics: { value: AITableFilterLogical; label: string }[] = [
    { value: AITableFilterLogical.and, label: '且' },
    { value: AITableFilterLogical.or, label: '或' }
];

export const fieldOperationsMap: Partial<Record<AITableFieldType, AITableFilterOperation[]>> = {
    [AITableFieldType.text]: [
        AITableFilterOperation.contain,
        AITableFilterOperation.notContain,
        AITableFilterOperation.empty,
        AITableFilterOperation.exists
    ],
    [AITableFieldType.number]: [
        AITableFilterOperation.eq,
        AITableFilterOperation.ne,
        AITableFilterOperation.gt,
        AITableFilterOperation.lt,
        AITableFilterOperation.gte,
        AITableFilterOperation.lte,
        AITableFilterOperation.empty,
        AITableFilterOperation.exists
    ],
    [AITableFieldType.date]: [
        AITableFilterOperation.eq,
        AITableFilterOperation.ne,
        AITableFilterOperation.gt,
        AITableFilterOperation.lt,
        AITableFilterOperation.gte,
        AITableFilterOperation.lte,
        AITableFilterOperation.between,
        AITableFilterOperation.empty,
        AITableFilterOperation.exists
    ],
    [AITableFieldType.richText]: [
        AITableFilterOperation.contain,
        AITableFilterOperation.notContain,
        AITableFilterOperation.empty,
        AITableFilterOperation.exists
    ],
    [AITableFieldType.select]: [
        AITableFilterOperation.in,
        AITableFilterOperation.nin,
        AITableFilterOperation.empty,
        AITableFilterOperation.exists
    ],
    [AITableFieldType.member]: [
        AITableFilterOperation.in,
        AITableFilterOperation.nin,
        AITableFilterOperation.empty,
        AITableFilterOperation.exists
    ],
    [AITableFieldType.link]: [
        AITableFilterOperation.contain,
        AITableFilterOperation.notContain,
        AITableFilterOperation.empty,
        AITableFilterOperation.exists
    ]
    // ...
};

export const operationLabelMap: Record<AITableFilterOperation, string> = {
    [AITableFilterOperation.eq]: '等于',
    [AITableFilterOperation.ne]: '不等于',
    [AITableFilterOperation.gt]: '大于',
    [AITableFilterOperation.lt]: '小于',
    [AITableFilterOperation.gte]: '大于等于',
    [AITableFilterOperation.lte]: '小于等于',
    [AITableFilterOperation.in]: '属于',
    [AITableFilterOperation.nin]: '不属于',
    [AITableFilterOperation.contain]: '包含',
    [AITableFilterOperation.notContain]: '不包含',
    [AITableFilterOperation.empty]: '为空',
    [AITableFilterOperation.exists]: '非空',
    [AITableFilterOperation.between]: '介于',
    [AITableFilterOperation.besides]: '不包含'
};

export function selectableFields(
    allOptions: AITableField[],
    selectedContions: AITableFilterCondition[],
    currentFieldId?: Id
): AITableField[] {
    const selectedContionsMap = helpers.keyBy(selectedContions, 'field_id');
    const selectedOptions = allOptions.filter(
        (option) => (currentFieldId ? option._id === currentFieldId : false) || !selectedContionsMap[option._id]
    );
    return selectedOptions;
}

/**
 * selectable fields of condition item
 */
@Pipe({
    name: 'selectableFields',
    standalone: true
})
export class SelectableFieldsExamplePipe implements PipeTransform {
    transform(fields: AITableField[], conditions: AITableFilterCondition[], fieldId?: Id): AITableField[] {
        return selectableFields(fields, conditions, fieldId);
    }
}

/**
 * selectable operations of field type
 */
@Pipe({
    name: 'fieldOperations',
    standalone: true
})
export class FieldOperationsExamplePipe implements PipeTransform {
    transform(fieldId: Id, fieldsMap: Record<Id, AITableField>): AITableFilterOperation[] {
        const fieldType = fieldsMap[fieldId]?.type as AITableFieldType;
        return fieldOperationsMap[fieldType] ?? [];
    }
}

/**
 * selectable options of select field type
 */
@Pipe({
    name: 'fieldOptions',
    standalone: true
})
export class FieldOptionsExamplePipe implements PipeTransform {
    transform(fieldId: Id, fieldsMap: Record<Id, AITableField>): AITableSelectOption[] {
        const fieldType = fieldsMap[fieldId]?.type as AITableFieldType;
        if (fieldType === AITableFieldType.select) {
            return (fieldsMap[fieldId]?.settings as SelectSettings)?.options ?? [];
        }
        return [];
    }
}
