import { AITable } from '../types';
import { AITableGridI18nKey, getI18nTextByKey } from '../../utils/i18n';
import { AITableFieldOption, AITableFieldType } from '@ai-table/utils';

export const AI_TABLE_FIELD_MINI_WIDTH = 140;
export const AI_TABLE_FIELD_MIN_WIDTH = 160;
export const AI_TABLE_FIELD_MIDDLE_WIDTH = 200;
export const AI_TABLE_FIELD_MAX_WIDTH = 300;

export function getFieldOptions(aiTable: AITable): AITableFieldOption[] {
    const defaultFieldOptions = [
        {
            type: AITableFieldType.text,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeText),
            icon: 'font',
            width: AI_TABLE_FIELD_MAX_WIDTH
        },
        {
            type: AITableFieldType.richText,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeRichText),
            icon: 'multiline-text',
            width: AI_TABLE_FIELD_MAX_WIDTH
        },
        {
            type: AITableFieldType.select,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeSelect),
            icon: 'check-circle',
            width: AI_TABLE_FIELD_MIN_WIDTH
        },
        {
            type: AITableFieldType.select,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeMultiSelect),
            icon: 'list-check',
            width: AI_TABLE_FIELD_MIDDLE_WIDTH,
            settings: {
                is_multiple: true
            }
        },
        {
            type: AITableFieldType.number,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeNumber),
            icon: 'hashtag',
            width: AI_TABLE_FIELD_MINI_WIDTH
        },
        {
            type: AITableFieldType.date,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeDate),
            icon: 'calendar',
            width: AI_TABLE_FIELD_MIDDLE_WIDTH
        },
        {
            type: AITableFieldType.member,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeMember),
            icon: 'user',
            width: AI_TABLE_FIELD_MIN_WIDTH,
            settings: {
                is_multiple: false
            }
        },
        {
            type: AITableFieldType.progress,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeProgress),
            icon: 'progress',
            width: AI_TABLE_FIELD_MIDDLE_WIDTH
        },
        {
            type: AITableFieldType.rate,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeRate),
            icon: 'star-circle',
            width: AI_TABLE_FIELD_MIN_WIDTH
        },
        {
            type: AITableFieldType.link,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeLink),
            icon: 'link-insert',
            width: AI_TABLE_FIELD_MIDDLE_WIDTH
        },
        {
            type: AITableFieldType.attachment,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeAttachment),
            icon: 'attachment',
            width: AI_TABLE_FIELD_MIDDLE_WIDTH
        },
        {
            type: AITableFieldType.createdBy,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeCreatedBy),
            icon: 'user',
            width: AI_TABLE_FIELD_MIN_WIDTH
        },
        {
            type: AITableFieldType.createdAt,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeCreatedAt),
            icon: 'calendar',
            width: AI_TABLE_FIELD_MIDDLE_WIDTH
        },
        {
            type: AITableFieldType.updatedBy,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeUpdatedBy),
            icon: 'user',
            width: AI_TABLE_FIELD_MIN_WIDTH
        },
        {
            type: AITableFieldType.updatedAt,
            name: getI18nTextByKey(aiTable, AITableGridI18nKey.fieldTypeUpdatedAt),
            icon: 'calendar',
            width: AI_TABLE_FIELD_MIDDLE_WIDTH
        }
    ];
    const fieldOptions: AITableFieldOption[] = [];
    Object.entries(aiTable.context?.aiFieldConfig()?.customFields || {}).forEach(([fieldType, fieldConfig]) => {
        if (fieldConfig?.fieldOption) {
            fieldOptions.push(fieldConfig.fieldOption);
        }
    });
    return [...defaultFieldOptions, ...fieldOptions];
}
