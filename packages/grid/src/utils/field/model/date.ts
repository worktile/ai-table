import { differenceInDays, differenceInMonths, fromUnixTime, subDays } from 'date-fns';
import { isArray, TinyDate } from 'ngx-tethys/util';
import {
    AITableFilterCondition,
    AITableFilterOperation,
    DateFieldBase,
    FieldOptions,
    isDateValid,
    AITableField,
    AITableFieldType,
    DateFieldValue,
    FieldValue,
    isEmpty,
    isUndefinedOrNull,
    isDateAndReturnDate,
    DEFAULT_FIELD_STAT_TYPE_ITEMS,
    AITableStatType
} from '@ai-table/utils';
import { FieldOperable } from '../field-operable';
import { compareNumber, isMeetFilter } from '../operate';
import { transformToCellText } from '../../cell';
import { FIELD_STAT_TYPE_MAP } from '../../../constants/field-stat';

export class DateField extends DateFieldBase implements FieldOperable<string, DateFieldValue> {
    constructor() {
        super([
            ...DEFAULT_FIELD_STAT_TYPE_ITEMS,
            FIELD_STAT_TYPE_MAP[AITableStatType.EarliestTime]!,
            FIELD_STAT_TYPE_MAP[AITableStatType.LatestTime]!,
            FIELD_STAT_TYPE_MAP[AITableStatType.DateRangeOfDays]!,
            FIELD_STAT_TYPE_MAP[AITableStatType.DateRangeOfMonths]!
        ]);
    }

    override transformCellValue(cellValue: FieldValue, options: FieldOptions) {
        return transformToCellText(cellValue, options);
    }

    isMeetFilter(condition: AITableFilterCondition<string>, cellValue: DateFieldValue) {
        const [left, right] = this.getTimeRange(condition.value);
        if (isUndefinedOrNull(cellValue)) {
            return condition.operation === AITableFilterOperation.empty;
        }
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue.timestamp) || cellValue.timestamp === 0;
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue.timestamp) && cellValue.timestamp !== 0;
            case AITableFilterOperation.eq:
                return left <= cellValue.timestamp && cellValue.timestamp < right;
            case AITableFilterOperation.gt:
                return cellValue.timestamp > right;
            case AITableFilterOperation.lt:
                return cellValue.timestamp < left;
            case AITableFilterOperation.between:
                return left <= cellValue.timestamp && cellValue.timestamp < right;
            default:
                return isMeetFilter(condition, cellValue);
        }
    }

    compare(cellValue1: DateFieldValue, cellValue2: DateFieldValue): number {
        const value1 = cellValueToSortValue(cellValue1);
        const value2 = cellValueToSortValue(cellValue2);
        return compareNumber(value1, value2);
    }

    toFieldValue(
        plainText: string,
        targetField: AITableField,
        originData?: { field: AITableField; cellValue: FieldValue }
    ): FieldValue | null {
        return toDateFieldValue(plainText, targetField, originData);
    }

    getTimeRange(value: string | number | number[]) {
        switch (value) {
            case 'today':
                return [new TinyDate(new Date()).startOfDay().getUnixTime(), new TinyDate(new Date()).endOfDay().getUnixTime()];
            case 'current_week':
                return [
                    new TinyDate().startOfWeek({ weekStartsOn: 1 }).getUnixTime(),
                    new TinyDate().endOfWeek({ weekStartsOn: 1 }).getUnixTime()
                ];
            case 'yesterday':
                return [
                    new TinyDate(subDays(new Date(), 1)).startOfDay().getUnixTime(),
                    new TinyDate(subDays(new Date(), 1)).endOfDay().getUnixTime()
                ];
            case 'current_month':
                return [new TinyDate().startOfMonth().getUnixTime(), new TinyDate().endOfMonth().getUnixTime()];
            default:
                if (isArray(value)) {
                    return [
                        new TinyDate(fromUnixTime(value[0] as number)).startOfDay().getUnixTime(),
                        new TinyDate(fromUnixTime(value[1] as number)).endOfDay().getUnixTime()
                    ];
                }
                return [
                    new TinyDate(fromUnixTime(value as number)).startOfDay().getUnixTime(),
                    new TinyDate(fromUnixTime(value as number)).endOfDay().getUnixTime()
                ];
        }
    }
}

export function toDateFieldValue(
    plainText: string,
    targetField: AITableField,
    originData?: { field: AITableField; cellValue: FieldValue }
): FieldValue | null {
    if (targetField.type === AITableFieldType.createdAt || targetField.type === AITableFieldType.updatedAt) {
        return null;
    }

    if (originData) {
        const { field, cellValue } = originData;
        switch (field.type) {
            case AITableFieldType.date:
                return cellValue;
            default:
                break;
        }
    }

    const texts = plainText
        .split(',')
        .map((text) => text.trim())
        .filter((text) => !!text);
    const value = texts && texts.length ? texts[0].trim() : plainText.trim();
    return transformDateValue(value);
}

function getTimeDay(value: string | number | number[]) {
    return new TinyDate(fromUnixTime(value as number)).startOfDay().getUnixTime();
}

function cellValueToSortValue(cellValue: DateFieldValue): number {
    if (isUndefinedOrNull(cellValue) || !isDateValid(cellValue)) {
        return 0;
    }
    const value = cellValue?.timestamp ?? 0;
    return value > 0 ? getTimeDay(value) : 0;
}

function transformDateValue(text: string): FieldValue | null {
    const date = isDateAndReturnDate(text);
    if (date) {
        return {
            timestamp: new TinyDate(date).getUnixTime()
        };
    }
    return null;
}
