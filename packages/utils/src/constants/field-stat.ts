import {
    statAverage,
    statCountAll,
    statCountEmpty,
    statCountFilled,
    statCountUnique,
    statMax,
    statMin,
    statPercentEmpty,
    statPercentFilled,
    statPercentUnique,
    statSum
} from '../helps/field-stat';
import { AITableFieldStatTypeItemInfo, AITableStatType } from '../types';

export const DEFAULT_FIELD_STAT_TYPE_MAP: Partial<Record<AITableStatType, AITableFieldStatTypeItemInfo>> = {
    [AITableStatType.None]: {
        name: '不展示',
        type: AITableStatType.None,
        format: '{{statValue}} 条记录',
        exec: statCountAll
    },
    [AITableStatType.CountAll]: {
        name: '记录总数',
        type: AITableStatType.CountAll,
        format: '{{statValue}} 条记录',
        exec: statCountAll
    },
    [AITableStatType.Filled]: {
        name: '已填写数',
        type: AITableStatType.Filled,
        format: '已填写 {{statValue}}',
        exec: statCountFilled
    },
    [AITableStatType.Empty]: {
        name: '未填写数',
        type: AITableStatType.Empty,
        format: '未填写 {{statValue}}',
        exec: statCountEmpty
    },
    [AITableStatType.Unique]: {
        name: '唯一数',
        type: AITableStatType.Unique,
        format: '唯一数 {{statValue}}',
        exec: statCountUnique
    },
    [AITableStatType.PercentFilled]: {
        name: '已填写占比',
        type: AITableStatType.PercentFilled,
        format: '已填写 {{statValue}}%',
        exec: statPercentFilled
    },
    [AITableStatType.PercentEmpty]: {
        name: '未填写占比',
        type: AITableStatType.PercentEmpty,
        format: '未填写 {{statValue}}%',
        exec: statPercentEmpty
    },
    [AITableStatType.PercentUnique]: {
        name: '唯一数占比',
        type: AITableStatType.PercentUnique,
        format: '唯一 {{statValue}}%',
        exec: statPercentUnique
    },
    [AITableStatType.Sum]: {
        name: '求和',
        type: AITableStatType.PercentUnique,
        format: '求和 {{statValue}}',
        exec: statSum
    },
    [AITableStatType.Max]: {
        name: '最大值',
        type: AITableStatType.Max,
        format: '最大值 {{statValue}}',
        exec: statMax
    },
    [AITableStatType.Min]: {
        name: '最小值',
        type: AITableStatType.Min,
        format: '最小值 {{statValue}}',
        exec: statMin
    },
    [AITableStatType.Average]: {
        name: '平均值',
        type: AITableStatType.Average,
        format: '平均值 {{statValue}}',
        exec: statAverage
    },
    [AITableStatType.Checked]: {
        name: '已勾选',
        type: AITableStatType.Checked,
        format: '已勾选 {{statValue}}',
        exec: statCountFilled
    },
    [AITableStatType.UnChecked]: {
        name: '未勾选',
        type: AITableStatType.UnChecked,
        format: '未勾选 {{statValue}}',
        exec: statCountEmpty
    },
    [AITableStatType.PercentChecked]: {
        name: '已选中占比',
        type: AITableStatType.PercentChecked,
        format: '已选中 {{statValue}}%',
        exec: statPercentFilled
    },
    [AITableStatType.PercentUnChecked]: {
        name: '未选中占比',
        type: AITableStatType.PercentUnChecked,
        format: '未选中 {{statValue}}%',
        exec: statPercentEmpty
    }
};

export const DEFAULT_FIELD_STAT_TYPE_ITEMS: AITableFieldStatTypeItemInfo[] = [
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.None]!,
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.CountAll]!,
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Filled]!,
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Empty]!,
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Unique]!,
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.PercentFilled]!,
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.PercentEmpty]!,
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.PercentUnique]!
];
