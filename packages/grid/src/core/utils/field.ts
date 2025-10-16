import { AI_TABLE_FIELD_MIDDLE_WIDTH, getFieldOptions } from '../constants/field';
import { AITableField, AITableFieldOption, AITableFieldType, IsMultiple, MemberSettings, idCreator } from '@ai-table/utils';
import { AITable } from '../types';
import { generateNewFieldName } from './name-creator';

export const isSystemField = (field: AITableField) => {
    return [AITableFieldType.createdAt, AITableFieldType.createdBy, AITableFieldType.updatedAt, AITableFieldType.updatedBy].includes(
        field.type as AITableFieldType
    );
};

export function createDefaultFieldName(aiTable: AITable, field: AITableFieldOption) {
    const fieldOption = getFieldOptionByField(aiTable, field);
    if (fieldOption) {
        return generateNewFieldName(aiTable, field, fieldOption.name);
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

export function isSameFieldOption(fieldOption: Pick<AITableFieldOption, 'type' | 'settings'>, field: Partial<AITableField>): boolean {
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
