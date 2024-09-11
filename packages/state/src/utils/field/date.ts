import { Field } from './field';
import { DateFieldValue } from '@ai-table/grid';
import { fromUnixTime, subDays } from 'date-fns';
import { isArray, TinyDate } from 'ngx-tethys/util';
import { AITableFilterCondition, AITableFilterOperation } from '../../types'
import { isEmpty } from '../common';

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
