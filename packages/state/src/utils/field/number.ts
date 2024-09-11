import { AITableFilterCondition, AITableFilterOperation } from '../../types';
import { Field } from './field';
import { FieldValue } from '@ai-table/grid';

export class NumberField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<number>, cellValue: FieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return cellValue == null;
            case AITableFilterOperation.exists:
                return cellValue != null;
            case AITableFilterOperation.eq:
                return !Number.isNaN(condition.value) && cellValue != null && condition.value === cellValue;
            case AITableFilterOperation.gte:
                return cellValue != null && cellValue >= condition.value;
            case AITableFilterOperation.lte:
                return cellValue != null && cellValue <= condition.value;
            case AITableFilterOperation.gt:
                return cellValue != null && cellValue > condition.value;
            case AITableFilterOperation.lt:
                return cellValue != null && cellValue < condition.value;
            case AITableFilterOperation.ne:
                return cellValue == null || Number.isNaN(condition.value) || cellValue !== condition.value;
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }
}
