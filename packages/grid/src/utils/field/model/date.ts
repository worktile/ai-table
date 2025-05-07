import { fromUnixTime, subDays } from 'date-fns';
import { isArray, TinyDate } from 'ngx-tethys/util';
import { AITableFilterCondition, AITableFilterOperation, DateFieldBase, FieldOptions, isDateValid } from '@ai-table/utils';
import { FieldOperable } from '../field-operable';
import { AITableField, AITableFieldType, DateFieldValue, FieldValue } from '@ai-table/utils';
import { compareNumber, isMeetFilter } from '../operate';
import { isEmpty, isNil } from 'lodash';
import { transformCellValue } from '../../cell';

export class DateField extends DateFieldBase implements FieldOperable<string, DateFieldValue> {
    override transformCellValue(cellValue: FieldValue, options: FieldOptions) {
        return transformCellValue(options.aiTable, options.field!, cellValue);
    }

    isMeetFilter(condition: AITableFilterCondition<string>, cellValue: DateFieldValue) {
        const [left, right] = this.getTimeRange(condition.value);
        if (isNil(cellValue)) {
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
    const dateValue = transformDateValue(value);
    if (dateValue) {
        return dateValue;
    }

    return null;
}

function cellValueToSortValue(cellValue: DateFieldValue): number {
    if (isNil(cellValue) || !isDateValid(cellValue)) {
        return 0;
    }
    return cellValue?.timestamp ?? 0;
}

function transformDateValue(text: string): FieldValue | null {
    const value = text.trim();
    if (!value || isEmpty(value)) return null;

    // 基础日期格式：支持识别 - / . 年月日 作为分隔符
    const datePattern = String.raw`(?:(\d{2}|\d{4})[-/.年](\d{1,2})[-/.月](\d{1,2})日?)`;
    const timePattern = String.raw`(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?`;

    const pattern = new RegExp(`^${datePattern}${timePattern}$`);
    const match = value.match(pattern);

    if (!match) return null;

    try {
        let [_, year, month, day] = match;

        if (year.length === 2) {
            const currentYear = new Date().getFullYear();
            const century = Math.floor(currentYear / 100) * 100;
            const twoDigitYear = parseInt(year);
            year = String(twoDigitYear > currentYear % 100 ? century - 100 + twoDigitYear : century + twoDigitYear);
        }

        const monthNum = parseInt(month);
        const dayNum = parseInt(day);

        if (monthNum < 1 || monthNum > 12) {
            console.warn('Invalid month:', monthNum);
            return null;
        }

        const maxDays = new Date(parseInt(year), monthNum, 0).getDate();
        if (dayNum < 1 || dayNum > maxDays) {
            console.warn('Invalid day:', dayNum);
            return null;
        }

        const standardDate = `${year}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        return {
            timestamp: new TinyDate(standardDate).getUnixTime()
        };
    } catch (error) {
        console.warn('Invalid date:', value);
        return null;
    }
}
