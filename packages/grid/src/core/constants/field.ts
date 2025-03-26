import { AITableFieldOption, AITableFieldType } from '../types';

export const AI_TABLE_FIELD_MINI_WIDTH = 140;
export const AI_TABLE_FIELD_MIN_WIDTH = 160;
export const AI_TABLE_FIELD_MIDDLE_WIDTH = 200;
export const AI_TABLE_FIELD_MAX_WIDTH = 300;

export const FieldOptions: AITableFieldOption[] = [
    {
        type: AITableFieldType.text,
        name: '单行文本',
        icon: 'font',
        width: AI_TABLE_FIELD_MAX_WIDTH
    },
    // 多行文本
    {
        type: AITableFieldType.select,
        name: '单选',
        icon: 'check-circle',
        width: AI_TABLE_FIELD_MIN_WIDTH
    },
    {
        type: AITableFieldType.select,
        name: '多选',
        icon: 'list-check',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH,
        settings: {
            is_multiple: true
        }
    },
    {
        type: AITableFieldType.number,
        name: '数字',
        icon: 'hashtag',
        width: AI_TABLE_FIELD_MINI_WIDTH
    },
    {
        type: AITableFieldType.date,
        name: '日期',
        icon: 'calendar',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH
    },
    {
        type: AITableFieldType.member,
        name: '成员',
        icon: 'user',
        width: AI_TABLE_FIELD_MIN_WIDTH,
        settings: {
            is_multiple: false
        }
    },
    // 级联单选
    // 级联多选
    {
        type: AITableFieldType.progress,
        name: '进度',
        icon: 'progress',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH
    },
    {
        type: AITableFieldType.rate,
        name: '评分',
        icon: 'star-circle',
        width: AI_TABLE_FIELD_MIN_WIDTH
    },
    {
        type: AITableFieldType.link,
        name: '链接',
        icon: 'link-insert',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH
    },
    {
        type: AITableFieldType.attachment,
        name: '附件',
        icon: 'attachment',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH
    },
    {
        type: AITableFieldType.createdBy,
        name: '创建人',
        icon: 'user',
        width: AI_TABLE_FIELD_MIN_WIDTH
    },
    {
        type: AITableFieldType.createdAt,
        name: '创建时间',
        icon: 'calendar',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH
    },
    {
        type: AITableFieldType.updatedBy,
        name: '更新人',
        icon: 'user',
        width: AI_TABLE_FIELD_MIN_WIDTH
    },
    {
        type: AITableFieldType.updatedAt,
        name: '更新时间',
        icon: 'calendar',
        width: AI_TABLE_FIELD_MIDDLE_WIDTH
    }
];
