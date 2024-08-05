import { helpers } from 'ngx-tethys/util';
import { AITableFieldInfo, AITableFieldType } from '../types';

export const BasicFields = [
    {
        type: AITableFieldType.text,
        text: '文本',
        icon: 'font',
        width: 300
    },
    {
        type: AITableFieldType.select,
        text: '单选',
        icon: 'check-circle',
        width: 200
    },
    {
        type: AITableFieldType.number,
        text: '数字',
        icon: 'hashtag',
        width: 200
    },
    {
        type: AITableFieldType.date,
        text: '日期',
        icon: 'calendar',
        width: 200
    },
    {
        type: AITableFieldType.rate,
        text: '评分',
        icon: 'star-circle',
        width: 200
    },
    {
        type: AITableFieldType.link,
        text: '链接',
        icon: 'link-insert',
        width: 300
    },
    {
        type: AITableFieldType.progress,
        text: '进度',
        icon: 'progress',
        width: 200
    }
];

export const Fields: AITableFieldInfo[] = [...BasicFields];

export const FieldsMap = helpers.keyBy([...BasicFields], 'type');
