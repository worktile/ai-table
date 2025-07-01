import { AITableRecords, FieldOptions, getFieldValues } from '@ai-table/utils';
import _ from 'lodash';
import { transformToCellText } from './cell';
import { differenceInDays, differenceInMonths, fromUnixTime } from 'date-fns';

export function statEarliestTime(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const values = getFieldValues(records, field!, true);
    const result = _.minBy(values, (value) => {
        return value.timestamp;
    });
    return transformToCellText(result, options);
}

export function statLatestTime(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const values = getFieldValues(records, field!, true);
    const result = _.maxBy(values, (value) => {
        return value.timestamp;
    });
    return transformToCellText(result, options);
}

export function statDateRangeOfDays(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const values = getFieldValues(records, field!, true);
    const start = _.minBy(values, (value) => {
        return value.timestamp;
    });
    const end = _.maxBy(values, (value) => {
        return value.timestamp;
    });
    if (start && end) {
        const days = differenceInDays(fromUnixTime(end.timestamp), fromUnixTime(start.timestamp));
        return days;
    }
    return 0;
}

export function statDateRangeOfMonths(records: AITableRecords, options: FieldOptions) {
    const { field } = options;
    const values = getFieldValues(records, field!, true);
    const start = _.minBy(values, (value) => {
        return value.timestamp;
    });
    const end = _.maxBy(values, (value) => {
        return value.timestamp;
    });
    if (start && end) {
        const months = differenceInMonths(fromUnixTime(end.timestamp), fromUnixTime(start.timestamp));
        return months;
    }
    return 0;
}
