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
import { AITableUtilsI18nKey } from '../helps/i18n';
import { AITableFieldStatTypeItemInfo, AITableStatType } from '../types';

export const DEFAULT_FIELD_STAT_TYPE_MAP: Partial<Record<AITableStatType, AITableFieldStatTypeItemInfo>> = {
    [AITableStatType.None]: {
        name: AITableUtilsI18nKey.none,
        type: AITableStatType.None,
        format: AITableUtilsI18nKey.none,
        exec: () => null
    },
    [AITableStatType.CountAll]: {
        name: AITableUtilsI18nKey.countAll,
        type: AITableStatType.CountAll,
        format: AITableUtilsI18nKey.countAllResult,
        exec: statCountAll
    },
    [AITableStatType.Filled]: {
        name: AITableUtilsI18nKey.filled,
        type: AITableStatType.Filled,
        format: AITableUtilsI18nKey.filledResult,
        exec: statCountFilled
    },
    [AITableStatType.Empty]: {
        name: AITableUtilsI18nKey.empty,
        type: AITableStatType.Empty,
        format: AITableUtilsI18nKey.emptyResult,
        exec: statCountEmpty
    },
    [AITableStatType.Unique]: {
        name: AITableUtilsI18nKey.unique,
        type: AITableStatType.Unique,
        format: AITableUtilsI18nKey.uniqueResult,
        exec: statCountUnique
    },
    [AITableStatType.PercentFilled]: {
        name: AITableUtilsI18nKey.percentFilled,
        type: AITableStatType.PercentFilled,
        format: AITableUtilsI18nKey.percentFilledResult,
        exec: statPercentFilled
    },
    [AITableStatType.PercentEmpty]: {
        name: AITableUtilsI18nKey.percentEmpty,
        type: AITableStatType.PercentEmpty,
        format: AITableUtilsI18nKey.percentEmptyResult,
        exec: statPercentEmpty
    },
    [AITableStatType.PercentUnique]: {
        name: AITableUtilsI18nKey.percentUnique,
        type: AITableStatType.PercentUnique,
        format: AITableUtilsI18nKey.percentUniqueResult,
        exec: statPercentUnique
    },
    [AITableStatType.Sum]: {
        name: AITableUtilsI18nKey.sum,
        type: AITableStatType.Sum,
        format: AITableUtilsI18nKey.sumResult,
        exec: statSum
    },
    [AITableStatType.Max]: {
        name: AITableUtilsI18nKey.max,
        type: AITableStatType.Max,
        format: AITableUtilsI18nKey.maxResult,
        exec: statMax
    },
    [AITableStatType.Min]: {
        name: AITableUtilsI18nKey.min,
        type: AITableStatType.Min,
        format: AITableUtilsI18nKey.minResult,
        exec: statMin
    },
    [AITableStatType.Average]: {
        name: AITableUtilsI18nKey.average,
        type: AITableStatType.Average,
        format: AITableUtilsI18nKey.averageResult,
        exec: statAverage
    },
    [AITableStatType.Checked]: {
        name: AITableUtilsI18nKey.checked,
        type: AITableStatType.Checked,
        format: AITableUtilsI18nKey.checkedResult,
        exec: statCountFilled
    },
    [AITableStatType.UnChecked]: {
        name: AITableUtilsI18nKey.unChecked,
        type: AITableStatType.UnChecked,
        format: AITableUtilsI18nKey.unCheckedResult,
        exec: statCountEmpty
    },
    [AITableStatType.PercentChecked]: {
        name: AITableUtilsI18nKey.percentChecked,
        type: AITableStatType.PercentChecked,
        format: AITableUtilsI18nKey.percentCheckedResult,
        exec: statPercentFilled
    },
    [AITableStatType.PercentUnChecked]: {
        name: AITableUtilsI18nKey.percentUnChecked,
        type: AITableStatType.PercentUnChecked,
        format: AITableUtilsI18nKey.percentUnCheckedResult,
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
