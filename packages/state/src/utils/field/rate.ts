import { isEmpty } from '../common';
import { AITableFilterCondition, AITableFilterOperation } from '../../types';
import { Field } from './field';
import { RateFieldValue } from '@ai-table/grid';

export class RateField extends Field {
    override isMeetFilter(condition: AITableFilterCondition<string[]>, cellValue: RateFieldValue | string) {
        switch (condition.operation) {
            case AITableFilterOperation.empty:
                return isEmpty(cellValue);
            case AITableFilterOperation.exists:
                return !isEmpty(cellValue);
            case AITableFilterOperation.in:
                return !isEmpty(cellValue) && condition.value.includes(cellValue.toString());
            case AITableFilterOperation.nin:
                return isEmpty(cellValue) || !condition.value.includes(cellValue.toString());
            default:
                return super.isMeetFilter(condition, cellValue);
        }
    }
}
