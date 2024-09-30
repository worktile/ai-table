import { FieldOptions } from '../constants/field';
import { AITable, AITableField, AITableFieldOption, AITableFieldType, IsMultiple } from '../types';
import { idCreator } from './id-creator';

export function getDefaultFieldValue(field: AITableField) {
    if (
        [AITableFieldType.member, AITableFieldType.createdBy, AITableFieldType.updatedBy].includes(field.type) ||
        (AITableFieldType.select === field.type && (field.settings as IsMultiple).is_multiple)
    ) {
        return [];
    }
    return '';
}

export function createDefaultFieldName(aiTable: AITable, field: AITableFieldOption) {
    const fieldOption = getFieldOptionByField(field);
    if (fieldOption) {
        const count = aiTable.fields().filter((item) => {
            return isSameFieldOption(field, item);
        }).length;
        return count === 0 ? fieldOption.name : fieldOption.name + ' ' + count;
    }
    return FieldOptions[0].name;
}

export function getFieldOptionByField(field: Partial<AITableField>) {
    return FieldOptions.find((item) => isSameFieldOption(item, field));
}

export function isSameFieldOption(fieldOption: AITableFieldOption, field: Partial<AITableField>): boolean {
    return (
        fieldOption.type === field.type &&
        (fieldOption.type === AITableFieldType.select
            ? !!(fieldOption.settings as IsMultiple)?.is_multiple === !!(field.settings as IsMultiple)?.is_multiple
            : true)
    );
}

export function createDefaultField(aiTable: AITable, type: AITableFieldType = AITableFieldType.text) {
    const fieldOption = FieldOptions.find((item) => item.type === type)!;
    return { _id: idCreator(), type, name: createDefaultFieldName(aiTable, fieldOption) };
}
