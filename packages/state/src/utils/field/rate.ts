import { AITableFilterCondition, AITableFilterOperation } from '../../types';
import { Field } from './field';
import { RateFieldValue } from '@ai-table/grid';

export class RateField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string[]>, cellValue: RateFieldValue) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return cellValue == null;
            case AITableFilterOperation.exists:
                return cellValue != null;
            case AITableFilterOperation.in:
                return cellValue != null && condition.value.includes(cellValue.toString());
            case AITableFilterOperation.nin:
                return cellValue === null || !condition.value.includes(cellValue.toString());
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }
}
