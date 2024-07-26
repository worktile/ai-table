import { AITableFieldInfo, AITableFieldType } from '../types';
import { helpers } from 'ngx-tethys/util';

export const BasicFields = [
    {
        type: AITableFieldType.Text,
        name: '文本',
        icon: 'font',
        width: 300
    },
    {
        type: AITableFieldType.SingleSelect,
        name: '单选',
        icon: 'check-circle',
        width: 200
    },
    {
        type: AITableFieldType.Number,
        name: '数字',
        icon: 'hashtag',
        width: 200
    },
    {
        type: AITableFieldType.DateTime,
        name: '日期',
        icon: 'calendar',
        width: 200
    },
    {
        type: AITableFieldType.Rating,
        name: '评分',
        icon: 'star-circle',
        width: 200
    },
    {
        type: AITableFieldType.Link,
        name: '链接',
        icon: 'link-insert',
        width: 300
    }
];

export const Fields: AITableFieldInfo[] = [...BasicFields];

export const FieldsMap = helpers.keyBy([...BasicFields], 'type');
