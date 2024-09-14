import { AITableFilterCondition, AITableFilterOperation } from '../../types';
import { Field } from './field';
import { FieldValue } from '@ai-table/grid';
import { isEmpty } from '../common';

export class NumberField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<number>, cellValue: FieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.eq:
                return !Number.isNaN(condition.value) && cellValue != null && cellValue !== '' && condition.value === cellValue;
            case AITableFilterOperation.gte:
                return cellValue != null && cellValue !== '' && cellValue >= condition.value;
            case AITableFilterOperation.lte:
                return cellValue != null && cellValue !== '' && cellValue <= condition.value;
            case AITableFilterOperation.gt:
                return cellValue != null && cellValue !== '' && cellValue > condition.value;
            case AITableFilterOperation.lt:
                return cellValue != null && cellValue !== '' && cellValue < condition.value;
            case AITableFilterOperation.ne:
                return cellValue == null || cellValue == '' || Number.isNaN(condition.value) || cellValue !== condition.value;
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }

    cellValueToString(_cellValue: FieldValue): string | null {
        return null;
    }

    static _compare(cellValue1: number, cellValue2: number): number {
        if (isEmpty(cellValue1) && isEmpty(cellValue2)) {
            return 0;
        }
        if (isEmpty(cellValue1)) {
            return -1;
        }
        if (isEmpty(cellValue2)) {
            return 1;
        }
        return cellValue1 === cellValue2 ? 0 : cellValue1 > cellValue2 ? 1 : -1;
    }

    override compare(cellValue1: number, cellValue2: number): number {
        return NumberField._compare(cellValue1, cellValue2);
    }
}
