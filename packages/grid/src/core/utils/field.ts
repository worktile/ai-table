import { AI_TABLE_FIELD_MIDDLE_WIDTH, getFieldOptions } from '../constants/field';
import { AITableField, AITableFieldOption, AITableFieldType, IsMultiple, MemberSettings, idCreator } from '@ai-table/utils';
import { generateNewName } from './common';
import { AITable } from '../types';

export const isArrayField = (field: AITableField) => {
    return [
        AITableFieldType.member,
        AITableFieldType.createdBy,
        AITableFieldType.updatedBy,
        AITableFieldType.select,
        AITableFieldType.attachment,
        AITableFieldType.richText
    ].includes(field.type as AITableFieldType);
};

export const isSystemField = (field: AITableField) => {
    return [AITableFieldType.createdAt, AITableFieldType.createdBy, AITableFieldType.updatedAt, AITableFieldType.updatedBy].includes(
        field.type as AITableFieldType
    );
};

export const isNumberFiled = (field: AITableField) => {
    return [AITableFieldType.number, AITableFieldType.progress, AITableFieldType.rate].includes(field.type as AITableFieldType);
};

export const isDateFiled = (field: AITableField) => {
    return [AITableFieldType.date, AITableFieldType.createdAt, AITableFieldType.updatedAt].includes(field.type as AITableFieldType);
};

export function getDefaultFieldValue(field: AITableField) {
    if (isArrayField(field)) {
        return [];
    }
    if (isNumberFiled(field) || isDateFiled(field) || field.type === AITableFieldType.link || field.type === AITableFieldType.checkbox) {
        return null;
    }
    return '';
}

export function createDefaultFieldName(aiTable: AITable, field: AITableFieldOption) {
    const fieldOption = getFieldOptionByField(aiTable, field);
    if (fieldOption) {
        const allNames = aiTable.fields().map((item) => item.name);
        const count = aiTable.fields().filter((item) => {
            return isSameFieldOption(field, item);
        }).length;
        return generateNewName(allNames, count, fieldOption.name);
    }
    const fieldOptions = getFieldOptions(aiTable);
    return fieldOptions[0].name;
}

export function getFieldOptionByField(aiTable: AITable, field: Partial<AITableField>) {
    const fieldOptions = getFieldOptions(aiTable);
    let fieldOption = fieldOptions.find((item) => isSameFieldOption(item, field));
    if (fieldOption && field.type === AITableFieldType.member && (field.settings as MemberSettings)?.is_multiple) {
        fieldOption.width = AI_TABLE_FIELD_MIDDLE_WIDTH;
    }
    return fieldOption;
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
    const fieldOptions = getFieldOptions(aiTable);
    const fieldOption = fieldOptions.find((item) => item.type === type)!;
    return { _id: idCreator(), type, name: createDefaultFieldName(aiTable, fieldOption) };
}
