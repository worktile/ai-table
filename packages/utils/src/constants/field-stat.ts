import { countAll, countEmpty, countFilled } from '../helps/field-stat';
import { AITableFieldStatTypeItemInfo, AITableStatType } from '../types';

export const FIELD_STAT_DEFAULT_MENUS: AITableFieldStatTypeItemInfo[] = [
    {
        name: '记录总数',
        type: AITableStatType.CountAll,
        format: '{{statValue}} 条记录',
        exec: countAll
    },
    {
        name: '已填写数',
        type: AITableStatType.Filled,
        format: '已填写 {{statValue}}',
        exec: countFilled
    },
    {
        name: '未填写数',
        type: AITableStatType.Empty,
        format: '未填写 {{statValue}}',
        exec: countEmpty
    }
];
