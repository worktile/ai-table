import { helpers } from 'ngx-tethys/util';
import { AITableFieldInfo, AITableFieldType } from '../types';

export const BasicFields = [
    {
        type: AITableFieldType.text,
        name: '文本',
        icon: 'font',
        width: 300
    },
    {
        type: AITableFieldType.select,
        name: '单选',
        icon: 'check-circle',
        width: 200
    },
    {
        type: AITableFieldType.number,
        name: '数字',
        icon: 'hashtag',
        width: 200
    },
    {
        type: AITableFieldType.date,
        name: '日期',
        icon: 'calendar',
        width: 200
    },
    {
        type: AITableFieldType.rate,
        name: '评分',
        icon: 'star-circle',
        width: 200
    },
    {
        type: AITableFieldType.link,
        name: '链接',
        icon: 'link-insert',
        width: 300
    },
    {
        type: AITableFieldType.progress,
        name: '进度',
        icon: 'progress',
        width: 200
    }
];

export const Fields: AITableFieldInfo[] = [...BasicFields];

export const FieldsMap = helpers.keyBy([...BasicFields], 'type');
