import { AITableFieldStatTypeItemInfo, AITableStatType, statCountAll } from '@ai-table/utils';
import { statDateRangeOfDays, statDateRangeOfMonths, statEarliestTime, statLatestTime } from '../utils';

export const FIELD_STAT_TYPE_MAP: Partial<Record<AITableStatType, AITableFieldStatTypeItemInfo>> = {
    [AITableStatType.EarliestTime]: {
        name: '最早时间',
        type: AITableStatType.EarliestTime,
        format: '最早时间 {{statValue}}',
        exec: statEarliestTime
    },
    [AITableStatType.LatestTime]: {
        name: '最晚时间',
        type: AITableStatType.LatestTime,
        format: '最晚时间 {{statValue}}',
        exec: statLatestTime
    },
    [AITableStatType.DateRangeOfDays]: {
        name: '时间范围(日)',
        type: AITableStatType.DateRangeOfDays,
        format: '时间范围 {{statValue}} 天',
        exec: statDateRangeOfDays
    },
    [AITableStatType.DateRangeOfMonths]: {
        name: '时间范围(月)',
        type: AITableStatType.DateRangeOfMonths,
        format: '时间范围 {{statValue}} 月',
        exec: statDateRangeOfMonths
    }
};
