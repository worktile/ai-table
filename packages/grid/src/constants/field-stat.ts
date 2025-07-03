import { AITableFieldStatTypeItemInfo, AITableStatType, statCountAll } from '@ai-table/utils';
import { AITableGridI18nKey, statDateRangeOfDays, statDateRangeOfMonths, statEarliestTime, statLatestTime } from '../utils';

export const FIELD_STAT_TYPE_MAP: Partial<Record<AITableStatType, AITableFieldStatTypeItemInfo>> = {
    [AITableStatType.EarliestTime]: {
        name: AITableGridI18nKey.earliestTime,
        type: AITableStatType.EarliestTime,
        format: AITableGridI18nKey.earliestTimeResult,
        exec: statEarliestTime
    },
    [AITableStatType.LatestTime]: {
        name: AITableGridI18nKey.latestTime,
        type: AITableStatType.LatestTime,
        format: AITableGridI18nKey.latestTimeResult,
        exec: statLatestTime
    },
    [AITableStatType.DateRangeOfDays]: {
        name: AITableGridI18nKey.dateRangeOfDays,
        type: AITableStatType.DateRangeOfDays,
        format: AITableGridI18nKey.dateRangeOfDaysResult,
        exec: statDateRangeOfDays
    },
    [AITableStatType.DateRangeOfMonths]: {
        name: AITableGridI18nKey.dateRangeOfMonths,
        type: AITableStatType.DateRangeOfMonths,
        format: AITableGridI18nKey.dateRangeOfMonthsResult,
        exec: statDateRangeOfMonths
    }
};
