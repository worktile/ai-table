import { AITableFieldType } from '../types';
import { helpers } from 'ngx-tethys/util';

export const BasicFieldTypes = [
    {
        type: AITableFieldType.Text,
        name: '文本',
        icon: 'font'
    },
    {
        type: AITableFieldType.SingleSelect,
        name: '单选',
        icon: 'check-circle'
    },
    {
        type: AITableFieldType.Number,
        name: '数字',
        icon: 'hashtag'
    },
    {
        type: AITableFieldType.DateTime,
        name: '日期',
        icon: 'calendar'
    },
    {
        type: AITableFieldType.Rating,
        name: '评分',
        icon: 'star-circle'
    },
    {
        type: AITableFieldType.Link,
        name: '链接',
        icon: 'link-insert'
    }
];

export const FieldTypes = [...BasicFieldTypes];

export const FieldTypesMap = helpers.keyBy([...FieldTypes], 'type');
