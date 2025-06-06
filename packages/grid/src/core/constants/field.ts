import { AITable } from '../types';
import { AITableGridI18nKey, getI18nTextByKey } from '../../utils/i18n';
import { AITableFieldGroup, AITableFieldOption, AITableFieldType } from '@ai-table/utils';
import _ from 'lodash';

export const AI_TABLE_FIELD_MINI_WIDTH = 140;
export const AI_TABLE_FIELD_MIN_WIDTH = 160;
export const AI_TABLE_FIELD_MIDDLE_WIDTH = 200;
export const AI_TABLE_FIELD_MAX_WIDTH = 300;

export const defaultFieldOptions: AITableFieldOption[] = [
    {
        type: AITableFieldType.text,
        name: AITableGridI18nKey.fieldTypeText,
        icon: 'font',
        width: AI_TABLE_FIELD_MAX_WIDTH,
        group: AITableFieldGroup.base
    },
    {
        type: AITableFieldType.richText,
        name: AITableGridI18nKey.fieldTypeRichText,
        icon: 'multiline-text',
        width: AI_TABLE_FIELD_MAX_WIDTH,
        group: AITableFieldGroup.base
    },
    {
        type: AITableFieldType.select,
        name: AITableGridI18nKey.fieldTypeSelect,
        icon: 'check-circle',
        width: AI_TABLE_FIELD_MIN_WIDTH,
        group: AITableFieldGroup.base
    },
    {
        type: AITableFieldType.select,
        name: AITableGridI18nKey.fieldTypeMultiSelect,
        icon: 'list-check',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH,
        settings: {
            is_multiple: true
        },
        group: AITableFieldGroup.base
    },
    {
        type: AITableFieldType.number,
        name: AITableGridI18nKey.fieldTypeNumber,
        icon: 'hashtag',
        width: AI_TABLE_FIELD_MINI_WIDTH,
        group: AITableFieldGroup.base
    },
    {
        type: AITableFieldType.date,
        name: AITableGridI18nKey.fieldTypeDate,
        icon: 'calendar',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH,
        group: AITableFieldGroup.base
    },
    {
        type: AITableFieldType.member,
        name: AITableGridI18nKey.fieldTypeMember,
        icon: 'user',
        width: AI_TABLE_FIELD_MIN_WIDTH,
        settings: {
            is_multiple: false
        },
        group: AITableFieldGroup.base
    },
    {
        type: AITableFieldType.progress,
        name: AITableGridI18nKey.fieldTypeProgress,
        icon: 'progress',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH,
        group: AITableFieldGroup.base
    },
    {
        type: AITableFieldType.rate,
        name: AITableGridI18nKey.fieldTypeRate,
        icon: 'star-circle',
        width: AI_TABLE_FIELD_MIN_WIDTH,
        group: AITableFieldGroup.base
    },
    {
        type: AITableFieldType.link,
        name: AITableGridI18nKey.fieldTypeLink,
        icon: 'link-insert',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH,
        group: AITableFieldGroup.base
    },
    {
        type: AITableFieldType.attachment,
        name: AITableGridI18nKey.fieldTypeAttachment,
        icon: 'attachment',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH,
        group: AITableFieldGroup.base
    },
    {
        type: AITableFieldType.createdBy,
        name: AITableGridI18nKey.fieldTypeCreatedBy,
        icon: 'user',
        width: AI_TABLE_FIELD_MIN_WIDTH,
        group: AITableFieldGroup.advanced
    },
    {
        type: AITableFieldType.createdAt,
        name: AITableGridI18nKey.fieldTypeCreatedAt,
        icon: 'calendar',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH,
        group: AITableFieldGroup.advanced
    },
    {
        type: AITableFieldType.updatedBy,
        name: AITableGridI18nKey.fieldTypeUpdatedBy,
        icon: 'user',
        width: AI_TABLE_FIELD_MIN_WIDTH,
        group: AITableFieldGroup.advanced
    },
    {
        type: AITableFieldType.updatedAt,
        name: AITableGridI18nKey.fieldTypeUpdatedAt,
        icon: 'calendar',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH,
        group: AITableFieldGroup.advanced
    }
];

export function getFieldOptions(aiTable: AITable): AITableFieldOption[] {
    return aiTable.context?.fieldOptions()!;
}

export function getFieldOptionMap(aiTable: AITable): Map<string, AITableFieldOption> {
    return aiTable.context?.fieldOptionMap()!;
}
