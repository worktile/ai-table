import { fromUnixTime, subDays } from 'date-fns';
import { isArray, TinyDate } from 'ngx-tethys/util';
import { Field } from './field';
import { AITableFilterCondition, AITableFilterOperation } from '../../../types';
import { AITableField, AITableFieldType, DateFieldValue, FieldValue } from '../../../core';
import { compareNumber } from '../operate';
import { isEmpty } from '../../common';

export class DateField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string>, cellValue: DateFieldValue) {
        const [left, right] = this.getTimeRange(condition.value);
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
                return super.isMeetFilter(condition, cellValue);
        }
    }

    override compare(cellValue1: DateFieldValue, cellValue2: DateFieldValue): number {
        const value1 = cellValueToSortValue(cellValue1);
        const value2 = cellValueToSortValue(cellValue2);
        return compareNumber(value1, value2);
    }

    override pasteValue(
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
                case AITableFieldType.text:
                    const dateValue = transformDateValue(cellValue);
                    if (dateValue) {
                        return dateValue;
                    }
                    break;
                default:
                    break;
            }
        } else {
            const dateValue = transformDateValue(plainText);
            if (dateValue) {
                return dateValue;
            }
        }

        return null;
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

function cellValueToSortValue(cellValue: DateFieldValue): number {
    return cellValue?.timestamp;
}

function transformDateValue(text: string): FieldValue | null {
    const value = text.trim();
    const pattern = /^\d{4}-\d{1,2}-\d{1,2}$/;

    if (value && !isEmpty(value) && pattern.test(value)) {
        const dateValue = {
            timestamp: new TinyDate(value).getUnixTime()
        };
        return dateValue;
    }
    return null;
}
